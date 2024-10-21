import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,  // 로그인한 사용자 정보
    token: localStorage.getItem('accessToken') || null, // 토큰을 저장하여 인증 상태 관리
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('accessToken', token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('accessToken');
    }
  },
  actions: {
    login({ commit }, { user, token }) {
      commit('setUser', user);
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
  },
  modules: {
    // 다른 모듈을 여기에 추가할 수 있습니다.
  }
})