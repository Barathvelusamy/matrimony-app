require("dotenv").config({ quiet: true });
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

jest.setTimeout(30000);

const testUri = process.env.MONGO_URI.replace("/matrimony?", "/matrimony_test?");

beforeAll(async () => {
  if (testUri === process.env.MONGO_URI) {
    throw new Error("Could not build test database URI. Check MONGO_URI.");
  }
  await mongoose.connect(testUri);
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API (email OTP)", () => {
  const person = { name: "Test User", email: "test@example.com" };

  const register = () => request(app).post("/api/auth/register").send(person);
  const verify = (otp) =>
    request(app).post("/api/auth/verify-otp").send({ email: person.email, otp });

  it("registers and sends a 6 digit code", async () => {
    const res = await register();
    expect(res.statusCode).toBe(201);
    expect(res.body.devOtp).toHaveLength(6);
  });

  it("rejects an invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "X", email: "not-an-email" });
    expect(res.statusCode).toBe(400);
  });

  it("rejects registration without a name", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: person.email });
    expect(res.statusCode).toBe(400);
  });

  it("logs in after verifying the correct code", async () => {
    const reg = await register();
    const res = await verify(reg.body.devOtp);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects a wrong code", async () => {
    await register();
    const res = await verify("000000");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Wrong code");
  });

  it("blocks after 5 wrong attempts even with the right code", async () => {
    const reg = await register();
    for (let i = 0; i < 5; i++) await verify("000000");
    const res = await verify(reg.body.devOtp);
    expect(res.statusCode).toBe(429);
  });

  it("rejects registering an already verified email", async () => {
    const reg = await register();
    await verify(reg.body.devOtp);
    const res = await register();
    expect(res.statusCode).toBe(400);
  });

  it("sends a code on login for an existing user", async () => {
    const reg = await register();
    await verify(reg.body.devOtp);
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: person.email });
    expect(login.statusCode).toBe(200);
    const res = await verify(login.body.devOtp);
    expect(res.body.token).toBeDefined();
  });

  it("returns 404 on login for an unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com" });
    expect(res.statusCode).toBe(404);
  });

  it("blocks /me without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });

  it("returns the user on /me with a valid token", async () => {
    const reg = await register();
    const verified = await verify(reg.body.devOtp);
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${verified.body.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(person.email);
  });
});