import superagent from 'superagent';

const POST_TYPES = {
  CASE_STUDY: 'case-studies',
  NEWS_ITEM: 'news-items',
  TESTIMONIAL: 'testimonials',
  PROJECT: 'projects'
}

const getPosts = async (type, langCode) => {
  const url = `${process.env.REACT_APP_WORDPRESS_API_URL}/${langCode.toLowerCase()}/${process.env.REACT_APP_WORDPRESS_API_ENDPOINT}/${type}`;
  return await makeRequest(url);
}

const getPost = async (type, name, langCode) => {
  const url = `${process.env.REACT_APP_WORDPRESS_API_URL}/${langCode.toLowerCase()}/${process.env.REACT_APP_WORDPRESS_API_ENDPOINT}/${type}/${name}`;
  return await makeRequest(url);
}

const makeRequest = async (url) => {
  try {
    const { body } = await superagent.get(url);
    return body;
  } catch (err) {
    console.error(err);
    throw err
  }
}

export { POST_TYPES, getPosts, getPost };
