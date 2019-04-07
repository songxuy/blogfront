const state = () => ({
    lists: {
        data: [],
        hasNext: 0,
        page: 1,
        path: ''
    },
    item: {
        data: {},
        path: '',
        isLoad: false
    }
})

const actions = {
    async ['getCommentList'](
        {
            commit,
            state,
            rootState: { $api }
        },
        config
    ) {
        if (config.path === state.lists.path && config.page === 1) return
        const { code, data } = await $api.get('frontend/comment/list', { ...config, cache: true })
        if (data && code === 200) {
            commit('recevieCommentList', {
                ...config,
                ...data
            })
        }
    }
}

const mutations = {
    ['recevieCommentList'](state, { list, hasNext, hasPrev, page, path }) {
        if (page === 1) {
            list = [].concat(list)
        } else {
            list = state.lists.data.concat(list)
        }
        state.lists = {
            data: list,
            hasNext,
            hasPrev,
            page,
            path
        }
    },
    ['insertCommentItem'](state, data) {
        state.lists.data = [data].concat(state.lists.data)
    },
    ['insertCommentItem1'](state, data) {
        var obj = state.lists.data.find(item => item._id === data._id)
        console.log(obj)
        if (obj) {
            obj.list = data.list
        }
    },
    ['deleteComment'](state, id) {
        const obj = state.lists.data.find(ii => ii._id === id)
        obj.is_delete = 1
    },
    ['recoverComment'](state, id) {
        const obj = state.lists.data.find(ii => ii._id === id)
        obj.is_delete = 0
    },
    ['modifyLikeStatu'](state, { id, status }) {
        if (state.item.data._id === id) {
            if (status) state.item.data.zanNum++
            else state.item.data.zanNum--
            state.item.data.isZan = status
        }
        const obj = state.lists.data.find(item => item._id === id)
        if (obj) {
            if (status) obj.zanNum++
            else obj.zanNum--
            obj.isZan = status
        }
    }
}

const getters = {
    ['getCommentList'](state) {
        return state.lists
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
