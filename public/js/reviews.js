// reviews.js — handles the review list + form on the item detail page (Track 5)

(function () {
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');

    const reviewsListEl = document.getElementById('reviews-list');
    const reviewFormEl = document.getElementById('review-form');

    if (!itemId) return;

    function loadReviews() {
        fetch(`/menu/${itemId}/reviews`)
            .then(res => res.json())
            .then(reviews => {
                reviewsListEl.innerHTML = '';
                if (reviews.length === 0) {
                    reviewsListEl.innerHTML = '<p>No reviews yet. Be the first!</p>';
                    return;
                }
                reviews.forEach(review => {
                    const div = document.createElement('div');
                    div.className = 'review-item';
                    div.innerHTML = `
                        <p class="review-rating">Rating: ${review.rating} / 5</p>
                        <p class="review-comment">${review.comment}</p>
                        <p class="review-author">- ${review.user && review.user.name ? review.user.name : 'Anonymous'}</p>
                    `;
                    reviewsListEl.appendChild(div);
                });
            })
            .catch(err => console.error('Could not load reviews:', err));
    }

    if (reviewFormEl) {
        reviewFormEl.addEventListener('submit', function (e) {
            e.preventDefault();
            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value;

            fetch(`/menu/${itemId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ rating, comment })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Could not submit review');
                    return res.json();
                })
                .then(() => {
                    reviewFormEl.reset();
                    loadReviews();
                })
                .catch(err => {
                    alert('Error submitting review. Are you logged in as a customer?');
                    console.error(err);
                });
        });
    }

    loadReviews();
})();
