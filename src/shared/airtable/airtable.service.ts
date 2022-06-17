import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
const axios = require('axios').default;

@Injectable()
export class AirtableService {
  static API_ROOT = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
  private axios;
  constructor() {
    const instance = axios.create({
      baseURL: AirtableService.API_ROOT,
    });

    // Alter defaults after instance has been created
    instance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${process.env.AIRTABLE_API_KEY}`;
    this.axios = instance;
  }

  createPostRecord(post: Post) {
    return this.axios({
      method: 'POST',
      data: {
        records: [
          {
            fields: {
              title: post.title,
              content: post.content,
              id: post.id,
              author_id: post.authorId,
            },
          },
        ],
      },
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err, err.data, err?.data?.error);
        throw err;
      });
  }
}
