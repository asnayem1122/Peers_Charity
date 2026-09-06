import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { UserProfile } from '../../src/models/UserProfile.js';

describe('UserProfile API Integration Tests', () => {
  beforeEach(async () => {
    await UserProfile.deleteMany({});
  });

  it('Status 200: Resolves public profile queried by string userId (Better-Auth format)', async () => {
    const profile = await UserProfile.create({
      userId: 'user_top_contributor_str_id',
      name: 'Tanvir Hossain',
      email: 'tanvir@baust.edu.bd',
      role: 'STUDENT',
      charityPoints: 120,
      studentIdNumber: '210201044',
    });

    const response = await request(app).get(`/api/users/${profile.userId}/profile`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Tanvir Hossain');
    expect(response.body.data.charityPoints).toBe(120);
    // Ensure sensitive fields are stripped
    expect(response.body.data.studentIdNumber).toBeUndefined();
    expect(response.body.data.email).toBeUndefined();
  });

  it('Status 200: Resolves public profile queried by MongoDB _id (ObjectId format)', async () => {
    const profile = await UserProfile.create({
      userId: 'user_regular_123',
      name: 'Rahim Uddin',
      email: 'rahim@baust.edu.bd',
      role: 'STUDENT',
      charityPoints: 40,
    });

    const response = await request(app).get(`/api/users/${profile._id.toString()}/profile`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Rahim Uddin');
  });

  it('Status 404: Returns 404 without CastError when non-existent string ID is queried', async () => {
    const response = await request(app).get('/api/users/non_existent_string_id_xyz/profile');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Benefactor profile not found');
  });

  it('Status 404: Returns 404 without CastError when non-existent ObjectId is queried', async () => {
    const randomObjectId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get(`/api/users/${randomObjectId}/profile`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Benefactor profile not found');
  });
});
