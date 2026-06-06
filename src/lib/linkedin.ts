import axios from 'axios';

const linkedinApi = axios.create({
  baseURL: 'https://api.linkedin.com/v2',
  headers: {
    'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export async function sendLinkedInMessage({
  recipientId,
  message,
}: {
  recipientId: string;
  message: string;
}) {
  try {
    const response = await linkedinApi.post('/messaging/conversations', {
      recipients: [recipientId],
      subject: 'Quick question',
      body: message,
    });

    return { success: true, conversationId: response.data.id };
  } catch (error) {
    console.error('LinkedIn API error:', error);
    throw error;
  }
}

export async function searchLinkedInProfile(email: string) {
  try {
    const response = await linkedinApi.get('/search/peopleSearch', {
      params: {
        q: 'email',
        email,
      },
    });

    return response.data;
  } catch (error) {
    console.error('LinkedIn search error:', error);
    throw error;
  }
}

export async function getLinkedInProfile(profileId: string) {
  try {
    const response = await linkedinApi.get(`/me?projection=(id,firstName,lastName,profilePicture(displayImage))`);

    return response.data;
  } catch (error) {
    console.error('LinkedIn profile error:', error);
    throw error;
  }
}
