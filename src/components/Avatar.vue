<template>
    <div class="avatar">
        <slot></slot>
    </div>
</template>
<style lang="less">
    @import "../assets/styles/design";

    .avatar {
        width: 100px;
        height: 100px;
        overflow: hidden;
        border-radius: 50%;
        margin: 5px 15px;

        & img {
            width: 100%;
            object-fit: cover;
            .object-fit(@fit: cover);
        }
    }

</style>