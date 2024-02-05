import request from "supertest";
import { app } from "../index.js";
import mongoose from "mongoose";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  await mongoose.connection.close();
});

let userId1;
let userId2;
let userId3;
let userId4 = "65ad08285547bc84730261db";
let postId1;
let postId2;
let postId3;

describe("testing auth", () => {
  it("register user success", async () => {
    const params1 = {
      username: "test1",
      email: "test1@gmail.com",
      password: "password",
    };
    const params2 = {
      username: "test2",
      email: "test2@gmail.com",
      password: "password",
    };
    const params3 = {
      username: "test3",
      email: "test3@gmail.com",
      password: "password",
    };
    const res1 = await request(app).post("/api/v1/auth/register").send(params1);
    const res2 = await request(app).post("/api/v1/auth/register").send(params2);
    const res3 = await request(app).post("/api/v1/auth/register").send(params3);
    userId1 = res1.body.data._id;
    userId2 = res2.body.data._id;
    userId3 = res3.body.data._id;
    expect(res1.statusCode).toBe(200);
    expect(res1.body.status).toBe("success");
    expect(res1.body.message).toBe("register success");
  });

  it("register user failed: validation error", async () => {
    const params = {
      username: "",
      email: "",
      password: "",
    };
    const res = await request(app).post("/api/v1/auth/register").send(params);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("validation error");
  });

  it("login user success", async () => {
    const params = {
      email: "test1@gmail.com",
      password: "password",
    };
    const res = await request(app).post("/api/v1/auth/login").send(params);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("login success");
  });

  it("login user failed: validation error", async () => {
    const params = {
      email: "",
      password: "",
    };
    const res = await request(app).post("/api/v1/auth/login").send(params);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("validation error");
  });

  it("login user failed: user email not found", async () => {
    const params = {
      email: "user1@gmail.com",
      password: "password",
    };
    const res = await request(app).post("/api/v1/auth/login").send(params);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("email not found");
  });

  it("login user failed: password is wrong", async () => {
    const params = {
      email: "test1@gmail.com",
      password: "password123",
    };
    const res = await request(app).post("/api/v1/auth/login").send(params);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("wrong password");
  });
});

describe("testing user", () => {
  it("update user success", async () => {
    const params = {
      userId: userId1,
      desc: "testing",
    };
    const res = await request(app).put(`/api/v1/users/${userId1}`).send(params);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("account has been updated");
  });

  it("update user password success", async () => {
    const params = {
      userId: userId1,
      password: "testing",
    };
    const res = await request(app).put(`/api/v1/users/${userId1}`).send(params);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("account has been updated");
  });

  it("update user failed: validation error", async () => {
    const params = {
      userId: "",
    };
    const res = await request(app).put(`/api/v1/users/${userId1}`).send(params);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("validation error");
  });

  it("update user failed: user id not found", async () => {
    const params = {
      userId: userId4,
    };
    const res = await request(app).put(`/api/v1/users/${userId4}`).send(params);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("user not found");
  });

  it("update user failed: difference body & params user id", async () => {
    const params = {
      userId: userId1,
      desc: "testing",
    };
    const res = await request(app).put(`/api/v1/users/${userId2}`).send(params);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("you can update only your account");
  });

  it("get user by id success", async () => {
    const res = await request(app).get(`/api/v1/users/${userId1}`);
    expect(res.statusCode).toBe(200);
  });

  it("get user by id failed: user id not found", async () => {
    const res = await request(app).get(`/api/v1/users/${userId4}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("user not found");
  });

  it("follow user success", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId2}/follows`)
      .send(params);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("user has been followed");
  });

  it("follow user failed: same user id", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId1}/follows`)
      .send(params);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("you cant follow yourself");
  });

  it("follow user failed: already followed user", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId2}/follows`)
      .send(params);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("you already follow this user");
  });

  it("follow user failed: target user id not found", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId4}/follows`)
      .send(params);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("target user not found");
  });

  it("follow user failed: current user id not found", async () => {
    const params = {
      userId: userId4,
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId2}/follows`)
      .send(params);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("current user not found");
  });

  it("follow user failed: validation error", async () => {
    const params = {
      userId: "",
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId2}/follows`)
      .send(params);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("validation error");
  });

  it("unfollow user success", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId2}/unfollows`)
      .send(params);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("user has been unfollowed");
  });

  it("unfollow user failed: validation error", async () => {
    const params = {
      userId: "",
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId2}/unfollows`)
      .send(params);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("validation error");
  });

  it("unfollow user failed: already unfollowed user", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId2}/unfollows`)
      .send(params);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("you dont follow this user");
  });

  it("unfollow user failed: same user id", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .put(`/api/v1/users/${userId1}/unfollows`)
      .send(params);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("you cant unfollow yourself");
  });

  it("unfollow user failed: current user not found", async () => {
    const params = {
      userId: userId4,
    };
    const res = await request(app)
        .put(`/api/v1/users/${userId1}/unfollows`)
        .send(params);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("current user not found");
  });

  it("delete user failed: different body & params user id", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .delete(`/api/v1/users/${userId2}`)
      .send(params);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("you can delete only your account");
  });

  it("delete user success", async () => {
    const params = {
      userId: userId1,
    };
    const res = await request(app)
      .delete(`/api/v1/users/${userId1}`)
      .send(params);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("account has been deleted");
  });
});

// describe("testing post", () => {
//   it("create post success", async () => {
//     const params1 = {
//       userId: userId2,
//       desc: "test post1",
//       img: "test-post1.png",
//       likes: 0,
//     };
//     const params2 = {
//       userId: userId2,
//       desc: "test post2",
//       img: "test-post2.png",
//       likes: 0,
//     };
//     const res1 = await request(app).post("/api/v1/posts").send(params1);
//     const res2 = await request(app).post("/api/v1/posts").send(params2);
//     postId1 = res1.body.data._id;
//     postId2 = res2.body.data._id;
//     expect(res1.statusCode).toBe(200);
//   });
//
//   it("get post timelines success", async () => {
//     const params = {
//       userId: userId2,
//     };
//     const res = await request(app).get("/api/v1/posts/timelines").send(params);
//     expect(res.statusCode).toBe(200);
//   });
//
//   it("update post success", async () => {
//     const params = {
//       userId: userId2,
//       desc: "updated post",
//     };
//     const res = await request(app).put(`/api/v1/posts/${postId1}`).send(params);
//     expect(res.statusCode).toBe(200);
//   });
//
//   it("update post failed: invalid user id", async () => {
//     const params = {
//       userId: "userId",
//       desc: "updated post 2",
//     };
//     const res = await request(app).put(`/api/v1/posts/${postId1}`).send(params);
//     expect(res.statusCode).toBe(403);
//   });
//
//   it("get post by id success", async () => {
//     const res = await request(app).get(`/api/v1/posts/${postId1}`);
//     expect(res.statusCode).toBe(200);
//   });
//
//   it("get post by id failed: invalid post id", async () => {
//     const res = await request(app).get("/api/v1/posts/postId");
//     expect(res.statusCode).toBe(500);
//   });
//
//   it("like post success", async () => {
//     const params = {
//       userId: userId3,
//     };
//     const res = await request(app)
//       .put(`/api/v1/posts/${postId1}/likes`)
//       .send(params);
//     expect(res.statusCode).toBe(200);
//   });
//
//   it("dislike post success", async () => {
//     const params = {
//       userId: userId3,
//     };
//     const res = await request(app)
//       .put(`/api/v1/posts/${postId1}/likes`)
//       .send(params);
//     expect(res.statusCode).toBe(200);
//   });
//
//   it("delete post failed: invalid user id", async () => {
//     const params = {
//       userId: userId3,
//     };
//     const res = await request(app)
//       .delete(`/api/v1/posts/${postId1}`)
//       .send(params);
//     expect(res.statusCode).toBe(403);
//   });
//
//   it("delete post success", async () => {
//     const params = {
//       userId: userId2,
//     };
//     const res = await request(app)
//       .delete(`/api/v1/posts/${postId1}`)
//       .send(params);
//     expect(res.statusCode).toBe(200);
//   });
//
//   it("delete post failed: post already deleted", async () => {
//     const params = {
//       userId: userId2,
//     };
//     const res = await request(app)
//       .delete(`/api/v1/posts/${postId1}`)
//       .send(params);
//     expect(res.statusCode).toBe(500);
//   });
// });
