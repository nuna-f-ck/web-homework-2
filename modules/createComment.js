import { escapeHtml } from './replaceCode.js'
import { updateComments, commentsList } from './arrayComments.js'
import { renderComments } from './render.js'

// Находим элементы из html
const nameInput = document.getElementById('name')
const commentInput = document.getElementById('comment')
const buttonForm = document.getElementById('button')

// Функция для добавления цитирования
export function quoteComment(userName, commentText) {
    const safeUserName = escapeHtml(userName)
    const safeCommentText = escapeHtml(commentText)

    const lines = safeCommentText.split('\n')
    const quotedText = lines
        .map((line) => `> ${safeUserName}, ${line}`)
        .join('\n')

    commentInput.value = `${quotedText}\n\n`

    commentInput.focus()
    commentInput.selectionStart = commentInput.value.length
    commentInput.selectionEnd = commentInput.value.length
}

export function createComment() {
    const commentsContainer = document.getElementById('comments');
    const addForm = document.querySelector('.add-form');

    buttonForm.addEventListener('click', () => {
        if (nameInput.value === '' || commentInput.value === '') {
            alert('Заполни все поля');
            return;
        }

   
        const loadingElement = document.createElement('div');
        loadingElement.textContent = 'Комментарий добавляется...';
        loadingElement.classList.add('loading');


        addForm.style.display = 'none';


        addForm.after(loadingElement);

        const newCommentForServer = {
            name: nameInput.value,
            text: commentInput.value
        };

        fetch('https://wedev-api.sky.pro/api/v1/gleb-fokin/comments', {
            method: 'POST',
            body: JSON.stringify(newCommentForServer),
        })
        .then(response => {
            if (response.status === 201) {
                return fetch('https://wedev-api.sky.pro/api/v1/gleb-fokin/comments');
            } else {
                throw new Error('Ошибка отправки');
            }
        })
        .then(response => response.json())
        .then(data => {
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

        
            addForm.style.display = 'flex';

      
            loadingElement.remove();

        
            nameInput.value = '';
            commentInput.value = '';
        })
        .catch(error => {
            console.error(error);
            alert('Не удалось отправить комментарий');

        
            addForm.style.display = 'flex';
            loadingElement.remove();
        });
    });
}