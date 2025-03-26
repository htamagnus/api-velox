import { Injectable } from '@nestjs/common';

@Injectable()
export default class StravaClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly baseUrl: string;

  constructor() {
    this.clientId = process.env.STRAVA_CLIENT_ID;
    this.clientSecret = process.env.STRAVA_CLIENT_SECRET;
    this.redirectUri = process.env.STRAVA_REDIRECT_URI;
    this.baseUrl = 'https://www.strava.com/api/v3';
  }

  // TO DO: tipar todos os retornos

  async exchangeCodeForToken(code: string) {
    console.log('code', code);
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao trocar o code pelo token do Strava');
    }

    return response.json(); // access_token, refresh_token, athlete, etc.
  }

  async getAthlete(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/athlete`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }

  async getActivities(accessToken: string, page = 1, perPage = 30) {
    const response = await fetch(
      `${this.baseUrl}/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log('response', response);
    return response.json();
  }

  async refreshAccessToken(refreshToken: string) {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao renovar o token do Strava');
    }

    return response.json(); // { access_token, refresh_token, expires_at, ... }
  }
}
