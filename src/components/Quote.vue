<template>
    <div class="text-description">
        <p :class="[blockBackground ? 'block-background' : 'text-background']">
            <span><slot></slot></span>
        </p>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },

        props: {
            textBackground: {
                type: Boolean,
                default: true,
            },
            blockBackground: {
                type: Boolean,
                default: false,
            },
        }
    }
</script>
<style lang="less" scoped>
    @import "../assets/styles/design";
    @import "../assets/styles/mixins";

    .text-description {
        color: white;
        margin-left: 24px;

        .text-background {
            span {
                background-color: @mainColor;
                padding: 15px;
                font-size: 20px;
                box-shadow: 10px 0 0 @mainColor, -10px 0 0 @mainColor;
                line-height: 57px;
            }

            &:first-letter {
                font-weight: 800;
                font-size: 90px;
                margin-right: 5px;
                color: @theme1-main;
            }
        }

        .block-background {
            padding: 10px;
            position: relative;
            z-index: 2;
            line-height: 17px;
            font-weight: 700;


            &:first-letter {
                font-weight: 900;
                font-size: 50px;
                color: @mainColor;
            }

            &:before {
                background-color: @theme1-main;
                content: '';
                position: absolute;
                width: 60%;
                height: 150%;
                left: -15px;
                top: -25px;
                z-index: -1;
                box-shadow: 4px 4px 24px 0 #000000a6;
            }

            &:after {
                background-color: @mainColor;
                content: '';
                position: absolute;
                width: 40%;
                height: 125%;
                right: 15px;
                top: -1px;
                z-index: -2;
                box-shadow: 4px 4px 24px 0 #000000a6;
            }

        }

    }

    .responsive(@tablet, { .text-description {
            font-size: 20px;

        .block-background {
            line-height: 35px;
            padding: 35px;

            &:before {
                left: 24px;
                top: -25px;
                z-index: -1;
                box-shadow: 4px 4px 24px 0 #000000a6;
            }

            &:after {
                right: -2px;
                top: -1px;
                z-index: -2;
                box-shadow: 4px 4px 24px 0 #000000a6;
            }
        }
    } });


</style>