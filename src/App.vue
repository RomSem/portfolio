<template>
    <div id="app" :class="theme">
        <div class="content" :class="{push: showNav}">
            <keep-alive>
                <router-view name="underHeader" ref="underHeader"></router-view>
            </keep-alive>
            <rosem-header :offsetValue="130" v-once></rosem-header>
            <component :is="$route.meta.layout">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </component>
            <rosem-progress-bar/>
            <rosem-footer v-once></rosem-footer>
        </div>
        <rosem-navigation></rosem-navigation>
        <rosem-cursor></rosem-cursor>
    </div>
</template>

<script>
    import RosemHeader from "./partials/Header"
    import RosemNavigation from "./partials/Navigation"
    import RosemFooter from "./partials/Footer"
    import RosemCursor from "./partials/Cursor"
    import RosemProgressBar from "./components/ProgressBar"
    import {mapState} from "vuex";

    export default {
        name: 'App',
        metaInfo: {
            title: 'rosem portfolio',
            titleTemplate: '%s | rosem portfolio',

            meta: [
                {
                    name: 'description',
                    content: 'Hello! This is my portfolio, please take a journey into this, and contact me in case you find something interesting for you.'
                },
            ],
        },
        components: {
            RosemHeader,
            RosemFooter,
            RosemNavigation,
            RosemProgressBar,
            RosemCursor,

        },

        computed: {
            ...mapState([
                'showNav',
                'loading'
            ]),
        },

        data() {
            return {
                theme: 'theme-default',
                isNavShown: false,
            }
        },

        methods: {},

        created() {
            this.$root.$on('change-theme', (theme) => {
                this.$refs.underHeader.$el.firstChild.style.background = '';
                this.theme = theme;
                localStorage.setItem('theme', this.theme);
            });

            this.theme = localStorage.getItem('theme') || this.theme;
        },
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,900');
</style>

<style lang="less">
    @import "./assets/styles/reset";
    @import "./assets/styles/design";
    @import "./assets/styles/themes";
    @import "./assets/styles/main";

    [v-cloak] {
        display: none;
    }

    #app, input, textarea {
        font-family: 'Montserrat', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #app {
        text-align: center;
    }

    .content {
        transition: right .5s ease-in-out;
        position: relative;
        overflow: hidden;
        z-index: 1;
        right: 0;
    }

    .content.push {
        right: 250px;

        .progress-bar {
            right: 250px;
        }

        header {
            left: -250px;
        }
    }

    .responsive(@tablet, { .content.push {
        right: 410px;

        .progress-bar {
            right: 410px;

        }

        header {
            left: -410px;
        }

    } });

</style>