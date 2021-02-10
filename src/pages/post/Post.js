import React, { useEffect, useState } from 'react';
import { getPost, POST_TYPES } from '../../redux/services/wpAPIClient';
import { useTranslation } from 'react-i18next';
import { Loader } from 'tsc-chameleon-component-library';
import { getTranslation } from '../../helpers/wp';
import { getHeaderGradient } from '../../helpers';

const Post = (props) => {
  const { i18n } = useTranslation();
  const [ post, setPost ] = useState(null);
  const postName = props.match.params.name;
  const prettyName = post ? getTranslation(i18n.language, post.new_item_title) : ''

  useEffect(() => {
    getPost(POST_TYPES.NEWS_ITEM, postName, i18n.language).then(setPost);
  }, [i18n.language, postName]);

  if (!post) {
    getPost(POST_TYPES.NEWS_ITEM, postName, i18n.language).then(setPost);
  }

  const headerBackgroundImage = getHeaderGradient(post && post.head_image);

  return post ? (
    <div className="c-post">
      <section className="u-font-white c-post__header u-flex c-section" style={{ backgroundImage: headerBackgroundImage }}>
        <h1 className="c-post__header-title u-text-capitalize u-text-spaced u-font-white">{prettyName}</h1>
      </section>
      <section className="c-section c-section--thin-width" dangerouslySetInnerHTML={{ __html: post.main_text }} />
    </div>
  ) : <Loader />
}

export default Post;
