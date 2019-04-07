<template>
    <div class="modal-wrap modal-signup-wrap" :class="show ? 'active' : ''">
        <span class="center-helper"></span>
        <div class="modal modal-signup">
            <h2 class="modal-title">注册</h2>
            <a @click="close" href="javascript:;" class="modal-close"><i class="icon icon-close-black"></i></a>
            <div class="modal-content">
                <div class="signup-form">
                    <div class="input-wrap">
                        <input v-model="form.username" type="text" placeholder="昵称" class="base-input" />
                        <p class="error-info input-info hidden">长度至少 6 位</p>
                    </div>
                    <div class="input-wrap">
                        <input v-model="form.email" type="text" placeholder="邮箱" class="base-input" />
                        <p class="error-info input-info hidden">长度至少 6 位</p>
                    </div>
                    <div class="input-wrap">
                        <input v-model="form.password" type="password" placeholder="密码" class="base-input" />
                        <p class="error-info input-info hidden">长度至少 6 位</p>
                    </div>
                    <div class="input-wrap">
                        <input v-model="form.re_password" type="password" placeholder="重复密码" class="base-input" />
                        <p class="error-info input-info hidden">长度至少 6 位</p>
                    </div>
                    <a @click="register" href="javascript:;" class="btn signup-btn  btn-blue">确认注册</a>
                    <a
                        @click="login"
                        style="color:#007fff;padding-top:10px;cursor:pointer;display:inline-block;"
                        class="btn"
                        >已有账号登录</a
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import api from '~api'
import { strlen, showMsg } from '~utils'

export default {
    name: 'sign-up',
    props: ['show'],
    data() {
        return {
            form: {
                username: '',
                email: '',
                password: '',
                re_password: ''
            }
        }
    },
    methods: {
        close() {
            this.$store.commit('global/showRegisterModal', false)
        },
        login() {
            this.$store.commit('global/showLoginModal', true)
            this.$store.commit('global/showRegisterModal', false)
        },
        async register() {
            if (!this.form.username || !this.form.password || !this.form.email) {
                showMsg('请将表单填写完整!')
                return
            } else if (strlen(this.form.username) < 3) {
                showMsg('用户长度2-8位!')
                return
            } else if (strlen(this.form.password) < 8) {
                showMsg('密码长度至少 8 位!')
                return
            } else if (this.form.password !== this.form.re_password) {
                showMsg('两次输入的密码不一致!')
                return
            }
            const { code, message } = await this.$store.$api.post('frontend/user/insert', this.form)
            if (code === 200) {
                showMsg({
                    type: 'success',
                    content: message
                })
                this.login()
            }
        }
    }
}
</script>
<style scoped>
.modal-signup .signup-form {
    width: 280px;
    margin: 20px auto 10px;
}

.signup-form {
    text-align: center;
}

.signup-form .input-wrap {
    position: relative;
}

.signup-form .input-wrap + .input-wrap {
    margin-top: 18px;
}

.signup-form .input-info {
    color: #bac1c2;
    font-size: 12px;
    margin-top: 10px;
    margin-left: 14px;
    text-align: left;
}

.signup-form .input-info.centered {
    text-align: center;
    margin-left: 0;
}

.signup-form .error-info {
    color: #ed4656;
}

.signup-form .base-input {
    width: 100%;
}

.signup-form .textarea-input {
    padding: 10px 14px;
    height: 88px;
    resize: none;
}

.signup-form .signup-btn {
    width: 100%;
    padding: 0;
    margin-top: 20px;
}
.modal > .modal-title {
    text-align: left;
    font-size: 20px;
    font-weight: normal;
    letter-spacing: 0.2em;
    text-indent: 0.2em;
    margin-left: 1rem;
    margin-top: 1rem;
}
</style>
