import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        article: {},
        author: {},
        cards: [],
        relatedArticles: [],
        loading: false
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
        }
    },

    actions: {
        getBlogCards({commit}) {
            commit('isLoading', true);

            return Vue.prototype.$prismic.client.query(
                Vue.prototype.$prismic.Predicates.at('document.type', 'article')
            ).then(response => {
                commit('isLoading', false);
                console.log(response);
                const cards = response.results.map(({uid, data, first_publication_date}) => {
                    return {
                        slug: uid,
                        title: data.title[0].text,
                        description: data.description[0].text,
                        publicationDate: first_publication_date,
                        background: data.background
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
                    console.log('article newQuery response', response);
                    const article = {
                        authorId: response.data.article_author.id,
                        prologue: response.data.prologue[0].text,
                        content: response.data.content,
                        publicationDate: response.first_publication_date,
                        tags: response.tags,
                        slug: response.uid,
                        title: response.data.title[0].text,
                        background: response.data.background,
                        relatedArticlesIds: response.data.related_articles.filter(article => {
                            return article.link.uid !== undefined;

                        }).map((article) => {
                            return article.link.uid
                        })

                    };
                        console.log(article.relatedArticlesIds);
                    commit('setArticle', article);
                    console.log('article newQuery', article);

                    return article
                }).then((article) => {
                    commit('isLoading', true);
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
                                        authorName: data.article_author.data.name[0].text,
                                        authorAvatar: data.article_author.data.avatar
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
    },

    getters: {
        sortedCards: (state) => {
            return state.cards.sort(function (a, b) {
                return new Date(b.publicationDate) - new Date(a.publicationDate);
            });

        },
    }
});