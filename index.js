import { renderComments } from './modules/render.js'
import { commentsList, updateComments } from './modules/arrayComments.js'
import { createComment } from './modules/createComment.js'
import { clickOnComment } from './modules/clickLikes.js'

const commentsContainer = document.getElementById('comments');

const downloadAlert = document.createElement('li');
downloadAlert.textContent = 'Комментарии загружаются...';
downloadAlert.classList.add('loading');

commentsContainer.appendChild(downloadAlert);

createComment()
clickOnComment()

fetch('https://wedev-api.sky.pro/api/v1/gleb-fokin/comments')
  .then((response) => response.json())
  .then((data) => {

    const formattedComments = data.comments.map(comment => {
      const date = new Date(comment.date);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      return {
        userName: comment.author.name,
        time: formattedDate,
        commentText: comment.text,
        likes: comment.likes || 0,
        isLiked: comment.isLiked || false,
      };
    });

    updateComments(formattedComments);
    renderComments(commentsList);

    // удаляем надпись после загрузки
    downloadAlert.remove();
  })
  .catch((error) => {
    console.error('Ошибка загрузки:', error);

    downloadAlert.textContent = 'Ошибка загрузки комментариев';
  });