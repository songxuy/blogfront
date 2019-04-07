<template>
    <div class="settings-section">
        <div class="settings-item with-input">
            <h4 class="settings-title">{{ title }}</h4>
            <div class="settings-item-content" :class="classes">
                <div class="settings-input-wrap">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'classes']
}
</script>
<style>
.settings-section .settings-item.with-input .settings-title {
    width: 120px;
}
.settings-section .settings-item .settings-item-content {
    margin-left: 120px;
}
</style>
