const templates = {
    card: function(context) {
        return `<div id='twitter-container'>
        <a id="twitter-link" href="" target="_blank"><i class="fa fa-twitter"></i></a>
        </div>
        <div id='quote-wrapper'>
        <blockquote id="quote">${context.quote}</blockquote>
        <cite id="author">${context.author}</cite>
        </div>
        <div id='buttons'>
        <button id='nxt-btn'>Next</button>
        </div>
        `
    }
}

export default templates;
