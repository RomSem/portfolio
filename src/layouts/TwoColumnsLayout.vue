<template>
    <div class="layout-2-cols">
            <aside>
                <router-view name="aside"></router-view>
            </aside>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    export default {
        name: "TwoColumnsLayout",

        data() {
            return {}
        },

        components: {},

        methods: {}
    }
</script>
<style lang="less" scoped>
    @import "../assets/styles/design";
    @import "../assets/styles/mixins";

    .layout-2-cols {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        background-color: white;

        & aside {
            padding: 15px 25px;
            width: 100%;
        }

        & .content {
            width: 100%;
        }
    }


    .responsive(@desktop, { .layout-2-cols {
        flex-direction: row;

        & aside {
            width: 30%;
        }
    } });

</style>
