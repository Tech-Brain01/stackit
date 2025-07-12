import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (in correct order due to foreign key constraints)
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Cleared existing data");

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "john_doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        username: "jane_smith",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        username: "alex_dev",
        email: "alex@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        username: "sarah_tech",
        email: "sarah@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        username: "mike_coder",
        email: "mike@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    }),
  ]);

  console.log("👥 Created users");

  // Create questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        title: "How to implement authentication in Node.js?",
        description:
          "I am building a web application using Node.js and Express. I need to implement user authentication with JWT tokens. What are the best practices for secure authentication?",
        tags: ["nodejs", "authentication", "jwt", "express", "security"],
        userId: users[0].id,
      },
    }),
    prisma.question.create({
      data: {
        title: "React vs Vue.js: Which should I choose for my project?",
        description:
          "I am starting a new frontend project and cannot decide between React and Vue.js. The project will be a medium-sized e-commerce application. What are the pros and cons of each?",
        tags: ["react", "vuejs", "frontend", "comparison", "javascript"],
        userId: users[1].id,
      },
    }),
    prisma.question.create({
      data: {
        title: "Database design best practices for scalability",
        description:
          "I am designing a database for a social media application that expects high traffic. What are the key principles I should follow to ensure scalability and performance?",
        tags: ["database", "scalability", "design", "performance", "sql"],
        userId: users[2].id,
      },
    }),
    prisma.question.create({
      data: {
        title: "How to deploy a Docker container to AWS?",
        description:
          "I have a Node.js application containerized with Docker. I want to deploy it to AWS. What are the different options available and which one would be most cost-effective for a small application?",
        tags: ["docker", "aws", "deployment", "nodejs", "cloud"],
        userId: users[3].id,
      },
    }),
    prisma.question.create({
      data: {
        title: "Understanding asynchronous programming in JavaScript",
        description:
          "I am confused about promises, async/await, and callbacks in JavaScript. Can someone explain the differences and when to use each approach?",
        tags: ["javascript", "async", "promises", "callbacks", "programming"],
        userId: users[4].id,
      },
    }),
  ]);

  console.log("❓ Created questions");

  // Create answers
  const answers = await Promise.all([
    // Answers for question 1 (Authentication)
    prisma.answer.create({
      data: {
        content:
          "For JWT authentication in Node.js, I recommend using the jsonwebtoken library. Here's a basic approach:\n\n1. Install required packages: `npm install jsonwebtoken bcrypt`\n2. Hash passwords before storing them\n3. Generate JWT tokens on successful login\n4. Create middleware to verify tokens\n5. Use environment variables for JWT secrets\n\nAlways implement proper error handling and consider token expiration times.",
        questionId: questions[0].id,
        userId: users[1].id,
      },
    }),
    prisma.answer.create({
      data: {
        content:
          "I'd also add that you should implement refresh tokens for better security. Short-lived access tokens (15-30 minutes) with longer-lived refresh tokens (7-30 days) provide a good balance between security and user experience. Also consider implementing rate limiting to prevent brute force attacks.",
        questionId: questions[0].id,
        userId: users[2].id,
      },
    }),
    // Answers for question 2 (React vs Vue)
    prisma.answer.create({
      data: {
        content:
          "For an e-commerce application, I'd recommend React for the following reasons:\n\n**Pros:**\n- Larger ecosystem and community\n- Better job market\n- More third-party libraries\n- Strong typing with TypeScript\n\n**Cons:**\n- Steeper learning curve\n- More boilerplate code\n\nVue.js is great for rapid prototyping and has a gentler learning curve, but React's ecosystem is more mature for e-commerce solutions.",
        questionId: questions[1].id,
        userId: users[0].id,
      },
    }),
    prisma.answer.create({
      data: {
        content:
          "I disagree with the previous answer. Vue.js is excellent for e-commerce applications. It has:\n\n- Better performance out of the box\n- Simpler syntax and easier learning curve\n- Great documentation\n- Nuxt.js for SSR/SSG capabilities\n\nUnless you specifically need React's ecosystem, Vue.js would be my choice for faster development and better developer experience.",
        questionId: questions[1].id,
        userId: users[3].id,
      },
    }),
    // Answers for question 3 (Database design)
    prisma.answer.create({
      data: {
        content:
          "Key principles for scalable database design:\n\n1. **Normalization**: Eliminate data redundancy\n2. **Indexing**: Create indexes on frequently queried columns\n3. **Partitioning**: Split large tables horizontally\n4. **Caching**: Implement Redis or Memcached\n5. **Read replicas**: Distribute read operations\n6. **Connection pooling**: Manage database connections efficiently\n\nFor social media, consider NoSQL databases like MongoDB for flexible schema and horizontal scaling.",
        questionId: questions[2].id,
        userId: users[4].id,
      },
    }),
    // Answers for question 4 (Docker AWS deployment)
    prisma.answer.create({
      data: {
        content:
          "For deploying Docker containers to AWS, you have several options:\n\n1. **AWS ECS (Elastic Container Service)**: Fully managed container orchestration\n2. **AWS EKS (Elastic Kubernetes Service)**: Managed Kubernetes\n3. **AWS App Runner**: Simplest option for containerized web apps\n4. **AWS EC2**: Manual setup but more control\n\nFor a small application, I recommend AWS App Runner as it's the most cost-effective and easiest to set up. It automatically handles load balancing, scaling, and HTTPS.",
        questionId: questions[3].id,
        userId: users[1].id,
      },
    }),
    // Answers for question 5 (Async JavaScript)
    prisma.answer.create({
      data: {
        content:
          'Here\'s a simple breakdown:\n\n**Callbacks**: Functions passed as arguments to other functions\n```javascript\ngetData(function(result) {\n  console.log(result);\n});\n```\n\n**Promises**: Objects representing eventual completion of async operations\n```javascript\ngetData().then(result => console.log(result));\n```\n\n**Async/Await**: Syntactic sugar over promises\n```javascript\nconst result = await getData();\nconsole.log(result);\n```\n\nUse async/await for cleaner, more readable code. Avoid callbacks to prevent "callback hell".',
        questionId: questions[4].id,
        userId: users[2].id,
      },
    }),
    prisma.answer.create({
      data: {
        content:
          "Great explanation! I'd add that error handling is crucial:\n\n**With Promises:**\n```javascript\ngetData()\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n```\n\n**With Async/Await:**\n```javascript\ntry {\n  const result = await getData();\n  console.log(result);\n} catch (error) {\n  console.error(error);\n}\n```\n\nAlways handle errors appropriately in asynchronous code!",
        questionId: questions[4].id,
        userId: users[0].id,
      },
    }),
  ]);

  console.log("💬 Created answers");

  // Create votes
  const votes = await Promise.all([
    // Votes for first answer (JWT implementation)
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[0].id,
        answerId: answers[0].id,
      },
    }),
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[2].id,
        answerId: answers[0].id,
      },
    }),
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[3].id,
        answerId: answers[0].id,
      },
    }),
    // Votes for refresh token answer
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[0].id,
        answerId: answers[1].id,
      },
    }),
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[4].id,
        answerId: answers[1].id,
      },
    }),
    // Mixed votes for React vs Vue answers
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[1].id,
        answerId: answers[2].id,
      },
    }),
    prisma.vote.create({
      data: {
        type: "DOWNVOTE",
        userId: users[2].id,
        answerId: answers[2].id,
      },
    }),
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[1].id,
        answerId: answers[3].id,
      },
    }),
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[4].id,
        answerId: answers[3].id,
      },
    }),
    // Votes for database design answer
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[0].id,
        answerId: answers[4].id,
      },
    }),
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[1].id,
        answerId: answers[4].id,
      },
    }),
    prisma.vote.create({
      data: {
        type: "UPVOTE",
        userId: users[2].id,
        answerId: answers[4].id,
      },
    }),
  ]);

  console.log("👍 Created votes");

  // Create comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content:
          "Great explanation! Do you have any recommendations for JWT libraries other than jsonwebtoken?",
        userId: users[3].id,
        answerId: answers[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "You could also use jose library, which is more modern and has better TypeScript support.",
        userId: users[1].id,
        answerId: answers[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "What about token storage? Should I use localStorage or httpOnly cookies?",
        userId: users[4].id,
        answerId: answers[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "HttpOnly cookies are more secure as they prevent XSS attacks from accessing tokens.",
        userId: users[2].id,
        answerId: answers[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Have you considered Svelte? It might be worth looking into for performance-critical applications.",
        userId: users[4].id,
        answerId: answers[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "What about database sharding? Should that be considered early in the design process?",
        userId: users[0].id,
        answerId: answers[4].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Sharding should be considered later when you actually need it. Premature optimization can cause more problems.",
        userId: users[4].id,
        answerId: answers[4].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "AWS Fargate might also be a good option for serverless container deployment.",
        userId: users[0].id,
        answerId: answers[5].id,
      },
    }),
  ]);

  console.log("💭 Created comments");

  // Create notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: "ANSWER",
        content:
          'Your question "How to implement authentication in Node.js?" received a new answer',
        relatedId: answers[0].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: "ANSWER",
        content:
          'Your question "How to implement authentication in Node.js?" received a new answer',
        relatedId: answers[1].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: "COMMENT",
        content: "Your answer received a new comment",
        relatedId: comments[0].id,
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: "ANSWER",
        content:
          'Your question "React vs Vue.js: Which should I choose for my project?" received a new answer',
        relatedId: answers[2].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[2].id,
        type: "COMMENT",
        content: "Your answer received a new comment",
        relatedId: comments[2].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[3].id,
        type: "ANSWER",
        content:
          'Your question "How to deploy a Docker container to AWS?" received a new answer',
        relatedId: answers[5].id,
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[4].id,
        type: "ANSWER",
        content:
          'Your question "Understanding asynchronous programming in JavaScript" received a new answer',
        relatedId: answers[6].id,
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[4].id,
        type: "ANSWER",
        content:
          'Your question "Understanding asynchronous programming in JavaScript" received a new answer',
        relatedId: answers[7].id,
        read: false,
      },
    }),
  ]);

  console.log("🔔 Created notifications");

  // Display summary
  const userCount = await prisma.user.count();
  const questionCount = await prisma.question.count();
  const answerCount = await prisma.answer.count();
  const voteCount = await prisma.vote.count();
  const commentCount = await prisma.comment.count();
  const notificationCount = await prisma.notification.count();

  console.log("\n📊 Seeding completed successfully!");
  console.log("📈 Summary:");
  console.log(`   Users: ${userCount}`);
  console.log(`   Questions: ${questionCount}`);
  console.log(`   Answers: ${answerCount}`);
  console.log(`   Votes: ${voteCount}`);
  console.log(`   Comments: ${commentCount}`);
  console.log(`   Notifications: ${notificationCount}`);
  console.log("\n🎉 Your database is now ready for development!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
