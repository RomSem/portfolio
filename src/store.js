import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        article: {},
        author: {},
        cards: [],
        relatedArticles: [],
        loading: false,
        totalPages: "",
        totalCards: "",
        showNav: false,
        instagram: {},
    },

    mutations: {
        setBlogCards(state, cards) {
            state.cards = cards;
        },
        setArticle(state, article) {
            state.article = article;
        },

        setRelatedArticles(state, relatedArticles) {
            state.relatedArticles = relatedArticles;
        },
        setAuthor(state, author) {
            state.author = author
        },

        isLoading(state, isLoading) {
            state.loading = isLoading;
        },

        totalCards(state, totalCards) {
            state.totalCards = totalCards;
        },
        totalPages(state, totalPages) {
            state.totalPages = totalPages;
        },

        navState(state, isOpen) {
            state.showNav = isOpen;
        },

        getPhotosFromInstagram(state, photoData) {
            state.instagram = photoData;
        }
    },

    actions: {
        getBlogCards({commit}, {perPage, currentPage}) {
            commit('isLoading', true);
            return Vue.prototype.$prismic.client.query(
                Vue.prototype.$prismic.Predicates.at('document.type', 'article'),
                {pageSize: perPage, page: currentPage, orderings: '[document.first_publication_date desc]'},
            ).then(response => {

                commit('isLoading', false);
                commit('totalCards', response.total_results_size);
                commit('totalPages', response.total_pages);

                const cards = response.results.map(({uid, data, first_publication_date}) => {
                    return {
                        slug: uid,
                        title: data.title[0].text,
                        description: data.description[0].text || null,
                        publicationDate: first_publication_date,
                        background: data.background,
                    }
                });

                commit('setBlogCards', cards);
            })
        },

        getArticle({commit, state}, slug) {
            commit('isLoading', true);
            return Vue.prototype.$prismic.client.getByUID('article', slug)
                .then((response) => {
                    commit('isLoading', false);

                    const article = {
                        authorId: response.data.article_author.id || null,
                        prologue: response.data.prologue.length > 0 ? response.data.prologue[0].text : null,
                        content: response.data.content || null,
                        publicationDate: response.first_publication_date,
                        tags: response.tags || null,
                        slug: response.uid,
                        title: response.data.title[0].text,
                        background: response.data.background,
                        relatedArticlesIds: response.data.related_articles.filter(article => {
                            return article.link.uid !== undefined;

                        }).map((article) => {
                            return article.link.uid
                        })

                    };
                    commit('setArticle', article);

                    return article
                }).then((article) => {
                    commit('isLoading', true);
                    if (article.authorId !== null) {
                        return Vue.prototype.$prismic.client.getByID(article.authorId)
                            .then((response) => {
                                commit('setAuthor', {
                                    name: response.data.name[0].text,
                                    description: response.data.about[0].text,
                                    avatar: response.data.avatar,
                                    links: response.data.links.map(link => {
                                        return {
                                            name: link.title[0].text,
                                            link: link.link.url
                                        }
                                    })
                                });
                                commit('isLoading', false);
                            })
                    }
                }).then(() => {
                        commit('isLoading', true);
                        if (state.article.relatedArticlesIds.length > 0) {
                            return Vue.prototype.$prismic.client.query(
                                Vue.prototype.$prismic.Predicates.in('my.article.uid', state.article.relatedArticlesIds),
                                {fetchLinks: ['author.name', 'author.avatar']}
                            ).then((response) => {
                                commit('isLoading', false);
                                const relatedArticlesData = response.results.slice(0, 3).map(({data, uid, first_publication_date}) => {

                                    return {
                                        publicationDate: first_publication_date,
                                        title: data.title[0].text,
                                        background: data.background,
                                        slug: uid,
                                        authorName: data.article_author.data.name[0].text || null,
                                        authorAvatar: data.article_author.data.avatar || null
                                    }

                                });
                                commit('setRelatedArticles', relatedArticlesData);

                            });
                        } else {
                            commit('isLoading', false);
                            commit('setRelatedArticles', []);
                        }
                    }
                ).catch((error) => {
                    commit('isLoading', false);
                    console.error(error);
                    throw error

                });
        },

        getInstagramPhotos({dispatch}) {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest(),
                    responseData,
                    url = "https://api.instagram.com/v1/users/self/media/recent/?access_token=",
                    accessToken = "8440872427.1677ed0.51740d5b84624cbab3d90e2f8e224b66";

                request.open('GET', url + accessToken);
                request.onload = () => {
                    if (request.status === 200) {
                        resolve(request.responseText);
                        responseData = JSON.parse(request.responseText);
                        dispatch('extractInfo', responseData.data);

                    } else {
                        let error = new Error(request.statusText);
                        error.code = this.status;
                        reject(error);
                    }
                };

                request.send();
            });
        },

        extractInfo({commit}, data) {

            let instagram = [];

            data.forEach(item => {
                instagram.push(
                    {
                        imageSrc: item.images.standard_resolution.url,
                        likes: item.likes.count,
                        postLink: item.link,
                        location: item.location !== null ? item.location.name : '',
                        carouselImages: getCarouselImages(),
                    }
                );

                function getCarouselImages() {
                    let carousel = [];
                    if (Object.prototype.hasOwnProperty.call(item, 'carousel_media')) {
                        item.carousel_media.forEach(carouselItem => {
                            carousel.push(carouselItem.images.standard_resolution.url);
                        });
                    }

                    return carousel;
                }

            });

            commit('getPhotosFromInstagram', instagram);
        },
    },
});