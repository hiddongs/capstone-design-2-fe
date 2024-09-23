<!-- src/components/LoginButton.vue -->
<template>
  <button :class="buttonClass" @click="loginMethod">
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  name: 'LoginButton',
  props: {
    buttonText: {
      type: String,
      required: true,
    },
    buttonClass: {
      type: String,
      default: 'btn btn-secondary', // DaisyUI의 기본 버튼 스타일
    },
    loginMethod: {
      type: Function,
      required: true,
    },
  },
};
</script>
