
<template>
    <button :class="buttonClass" @click="loginMethod">
      {{ buttonText }}
    </button>
  </template>
  
  <script>
  export default {
    name: 'SignUpButton',
    props: {
      buttonText: {
        type: String,
        required: true,
      },
      buttonClass: {
        type: String,
        default: 'btn btn-secondary', // DaisyUI
      },
      loginMethod: {
        type: Function,
        required: true,
      },
    },
  };
  </script>
  