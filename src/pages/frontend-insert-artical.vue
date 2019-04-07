<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <a-input title="标题">
                <input type="text" v-model="form.title" placeholder="标题" class="base-input" name="title" />
                <span class="input-info error">请输入标题</span>
            </a-input>
            <a-input title="分类" :classes="'select-item-wrap'">
                <i class="icon icon-arrow-down"></i>
                <select v-model="form.category" class="select-item" name="category">
                    <option value="">请选择分类</option>
                    <option v-for="item in category" :key="item._id" :value="item._id + '|' + item.cate_name">{{
                        item.cate_name
                    }}</option>
                </select>
                <span class="input-info error">请输入分类</span>
            </a-input>
            <a-input title="添加封面大图">
                <div class="img_pic">
                    <img :src="form.img" id="img" @click="addpicFun" crossOrigin="anonymous" />
                    <div class="add" @click="addpicFun">
                        <i class="el-icon-plus" style="color:#fff;font-size:40px;"></i>
                    </div>
                </div>
                <!-- <div class="add_pic"  @click="addpicFun" v-if="imageArr.length==0"></div> -->
                <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none" />
            </a-input>
            <div class="settings-section">
                <div id="post-content" class="settings-item-content">
                    <textarea
                        id="editor"
                        name="content"
                        class="form-control hidden"
                        data-autosave="editor-content"
                    ></textarea>
                </div>
            </div>
        </div>
        <div class="settings-footer clearfix">
            <a @click="insert" href="javascript:;" class="btn btn-yellow">添加文章</a>
        </div>
    </div>
</template>

<script>
/* global postEditor */
import { mapGetters } from 'vuex'
import { showMsg } from '~utils'
// import api from '~api'
import checkAdmin from '~mixins/check-admin'
import aInput from '../components/_input.vue'
import { uploadFile } from '../api/bridge.js'
import axios from 'axios'
export default {
    name: 'frontend-insert-artical',
    components: {
        aInput
    },
    data() {
        return {
            form: {
                title: '',
                category: '',
                content: '',
                img: ''
            },
            userinfo: {
                username: ''
            }
        }
    },
    async asyncData({ store, route }, config = { limit: 99 }) {
        config.all = 1
        await store.dispatch('global/category/getCategoryList', {
            ...config,
            path: route.path
        })
    },
    computed: {
        ...mapGetters({
            category: 'global/category/getCategoryList'
        })
    },
    mounted() {
        // eslint-disable-next-line
        window.postEditor = editormd('post-content', {
            width: '100%',
            height: 500,
            markdown: '',
            placeholder: '请输入内容...',
            path: '/static/editor.md/lib/',
            toolbarIcons() {
                return [
                    'bold',
                    'italic',
                    'quote',
                    '|',
                    'list-ul',
                    'list-ol',
                    'hr',
                    '|',
                    'link',
                    'reference-link',
                    'image',
                    'code',
                    'table',
                    '|',
                    'watch',
                    'preview',
                    'fullscreen'
                ]
            },
            watch: false,
            saveHTMLToTextarea: true
        })
        var _self = this
        axios
            .get('/api/frontend/user/account')
            .then(res => {
                _self.userinfo = res.data.data
            })
            .catch(function(error) {
                //alert(error);
            })
    },
    beforeDestroy() {
        console.log(1)
        this.form = null
    },
    methods: {
        addpicFun(e) {
            document.getElementById('upload_file').click()
        },
        fileChange(el) {
            if (!el.target.files[0].size) return // 判断是否有文件数量
            this.fileList(el.target.files) // 获取files文件组传入处理
            el.target.value = '' // 清空val值，以便可以重复添加一张图片
        },
        fileList(files) {
            for (let i = 0; i < files.length; i++) {
                this.fileAdd(files[i])
            }
        },
        fileAdd(file) {
            /* this.ruleForm.imageArr.splice(0, 1) // 去掉原来的
       this.ruleForm.imageArr.push(result) */
            var vm = this
            const reader = new FileReader()
            reader.vue = this
            reader.readAsDataURL(file)
            reader.onload = function() {
                //file.src = this.result
                // console.log(vm.imageArr1)
                console.log(reader)
                if (this.result.slice(11, 13) == 'pn') {
                    axios
                        .post('/api/upload/dataurl', {
                            data: this.result,
                            type: 'image/png'
                        })
                        .then(res => {
                            console.log(res)
                            vm.form.img = '' // 去掉原来的
                            vm.form.img = res.data.data
                            /* vm.form.img = '127.0.0.1/api/outside-img?url='+res.data.data */
                            /* axios.get('/api/outside-img',{
                 params:{
                     url:res.data.data
                 }
             },{responseType: 'arraybuffer'}).then((response) => {
                 var img = document.getElementById('img')
                 console.log(response.data)
                 img.src=   vm.getBase64Image(response.data);
                // vm.form.img = res.data.data
                /* var img = document.getElementById('img')
                img.src = window.URL.createObjectURL(response.data);
                img.onload = function() {
                    window.URL.revokeObjectURL(this.src);
                } */
                            /*}) */
                        })
                } else if (this.result.slice(11, 13) == 'jp') {
                    axios
                        .post('/api/upload/dataurl', {
                            data: this.result,
                            type: 'image/jpeg'
                        })
                        .then(res => {
                            console.log(res)
                            vm.form.img = '' // 去掉原来的
                            vm.form.img = res.data.data
                            /* vm.form.img = '127.0.0.1/api/outside-img?url='+res.data.data */
                            /* axios.get('/api/outside-img',{
                 params:{
                     url:res.data.data
                 }
             },{responseType: 'arraybuffer'}).then((response) => {
                 var img = document.getElementById('img')
                 console.log(response.data)
                 img.src=   vm.getBase64Image(response.data);
                // vm.form.img = res.data.data
                /* var img = document.getElementById('img')
                img.src = window.URL.createObjectURL(response.data);
                img.onload = function() {
                    window.URL.revokeObjectURL(this.src);
                } */
                            /*}) */
                        })
                } else {
                    showMsg('图片格式不存在!')
                }
            }
            /* uploadFile(file,function(result){
           if(result.status){
             vm.form.img = '' // 去掉原来的
             vm.form.img = result.data
           }else{
               showMsg('上传失败，请稍后再试!')
           }
       }) */
            console.log(file)
        },
        getBase64Image(img) {},
        async insert() {
            const content = postEditor.getMarkdown()
            if (!this.form.title || !this.form.category || !content) {
                showMsg('请将表单填写完整!')
                return
            }
            this.form.content = content
            this.form.username = this.userinfo.username
            this.form.usericon = this.userinfo.icon
            const { code, data, message } = await this.$store.$api.post('frontend/article/insert', this.form)
            if (code === 200) {
                showMsg({
                    type: 'success',
                    content: message
                })
                this.$store.commit('backend/article/insertArticleItem', data)
                this.$router.push('/')
            }
        }
    },
    metaInfo() {
        return {
            title: '发布文章 - S.X.Y 小屋',
            meta: [{ vmid: 'description', name: 'description', content: 'S.X.Y 小屋' }]
        }
    }
}
</script>
<style scoped>
.img_pic {
    position: relative;
    width: 250px;
    margin-left: 0px;
    height: 200px;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
}
.img_pic > img {
    width: 100%;
    display: inline-block;
    vertical-align: top;
}
.img_pic > div.add {
    width: 250px;
    position: absolute;
    height: 200px;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px dashed #c0ccda;
    box-sizing: border-box;
    font-size: 26px;
    border-radius: 5px;
    line-height: 200px;
    text-align: center;
    cursor: pointer;
}
.img_pic > div.add:hover {
    border: 1px dashed #409eff;
}
.settings-main .settings-main-content {
    position: relative;
    width: 80%;
    margin: 0 auto;
}
.settings-main .settings-footer {
    padding: 24px 10%;
}
</style>
