<template>
    <div class="loader " :class="{loaded: isLoading}">
        <div class="main-content intro">
            <h1>please wait! ...coming soon</h1>
            <div class="loader-dots">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },

        props: {
            isLoading: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../assets/styles/globalVariables";
    @import "../assets/styles/mixins";

    .loader {
        text-align: center;
        opacity: 1;
        transition: opacity 3s ease-in-out;
        position: fixed;
        z-index: 100;
        background-color: white;
        display: flex;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        h1 {
            color: @mainColor;
        }

        .loader-dots {
            display: inline-block;
            position: relative;
            width: 64px;
            height: 64px;

            & span {
                position: absolute;
                top: 27px;
                width: 11px;
                height: 11px;
                border-radius: 50%;
                animation-timing-function: cubic-bezier(0, 1, 1, 0);
                background-color: @mainColor;

                &:nth-child(1) {
                    left: 6px;
                    animation: lds-ellipsis1 0.6s infinite;
                }

                &:nth-child(2) {
                    left: 6px;
                    animation: lds-ellipsis2 0.6s infinite;
                }

                &:nth-child(3) {
                    left: 26px;
                    animation: lds-ellipsis2 0.6s infinite;
                }

                &:nth-child(4) {
                    left: 45px;
                    animation: lds-ellipsis3 0.6s infinite;
                }
            }
        }
    }

    .loader.loaded {
        opacity: 0;
    }

    .loader.fixed {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
    }

    @keyframes lds-ellipsis1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes lds-ellipsis3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }

    @keyframes lds-ellipsis2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(19px, 0);
        }
    }

</style>