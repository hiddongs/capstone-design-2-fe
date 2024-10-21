<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">실시간 Q&A</h2>
    <ul class="space-y-4">
      <li v-for="post in posts" :key="post.id" class="p-4 bg-white shadow rounded-md">
        <h3 class="font-bold">{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <small class="text-gray-500">{{ maskedName(post.writer) }} - {{ post.date }}</small>
      </li>
    </ul>
    <!-- Q&A 글 작성 -->
    <div class="mt-6">
      <h3 class="text-xl font-semibold mb-4">새로운 질문 작성하기</h3>
      <form @submit.prevent="submitQuestion" class="space-y-4">
        <div>
          <label for="title" class="block font-semibold">제목</label>
          <input v-model="newPost.title" id="title" class="w-full p-2 border rounded-lg" required />
        </div>
        <div>
          <label for="content" class="block font-semibold">내용</label>
          <textarea v-model="newPost.content" id="content" class="w-full p-2 border rounded-lg" required></textarea>
        </div>
        <button type="submit" class="py-2 px-4 bg-primary text-white rounded-lg">질문 등록</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [
        { id: 1, title: '진료 시간 문의', content: '진료 시간은 언제인가요?', writer: '홍길동', date: '2024-10-16' },
        { id: 2, title: '예약 방법', content: '진료 예약은 어떻게 하나요?', writer: '김철수', date: '2024-10-15' }
      ],
      newPost: {
        title: '',
        content: '',
        writer: '홍길동',
        date: new Date().toISOString().slice(0, 10)
      }
    };
  },
  methods: {
    submitQuestion() {
      this.posts.push({ ...this.newPost, id: this.posts.length + 1 });
      this.newPost.title = '';
      this.newPost.content = '';
    },
    maskedName(fullName) {
      const nameParts = fullName.split('');
      if (nameParts.length > 1) {
        return `${nameParts[0]}XX`;
      }
      return fullName;
    }
  }
};
</script>