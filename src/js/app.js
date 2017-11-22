'use strict';
import templates from './templates';
const quoteMachine = (function() {

//URLs
const   quotesUrl = 'https://talaikis.com/api/quotes/',
        tweetUrl = 'https://twitter.com/intent/tweet?text=';

let     quotesArr = [],
        currQuote = {},
        pqi = 0;

//dom elements
let     d_tweet,
        d_quote,
        d_author,
        d_next,
        d_app = document.getElementById('quote-machine');

//Initialise App;
init();

function bindEvents() {
    d_next.addEventListener('click', nextQuote);
}

function cacheDom() {
    d_tweet = document.getElementById('twitter-link');
    d_quote = document.getElementById('quote');
    d_author = document.getElementById('author');
    d_next = document.getElementById('nxt-btn');
}

function getApi(url) {
    //fetch returns a promise so getApi returns a promise, is now thenable
    return fetch(url)
            .then((res) => res.json())
            .then((data) => quotesArr = data)
}

function init() {
    getApi(quotesUrl)
    .then(() => {
        currQuote = quotesArr[random(quotesArr)];
        render(d_app, addTemplate(templates.card, currQuote));
        cacheDom();
        updateTweet(currQuote);
        bindEvents();
    });
}

function nextQuote() {
    currQuote = quotesArr[random(quotesArr)];
    render(d_quote, currQuote.quote);
    render(d_author, currQuote.author);
    updateTweet(currQuote);
}

function random(arr) {
    return Math.floor(Math.random() * arr.length) + 1;
}

function render(target, value) {
    target.innerHTML = value;
}
function addTemplate(template, context) {
    return template(context);
}
function updateTweet(quote) {
    d_tweet.href = `${tweetUrl}${quote[quote]}${quote[author]}`;
}

return {
    next: nextQuote,
}
})();


//https://au.indeed.com/cmp/IVvy/jobs/Entry-Level-Support-7de5f264657df1aa?sjdu=8EWtruxy728tzxKcUmN0cWHh0C0uYnrqqEeCi3vdtTEld0sVokIHwfnp6HoVXSNrPB5OuO91V-fmZ6QTFv_pD3k0PWpQDRYZoKYQraMIieeNeccF-OAXu1v7uQehIQod9qTN7ErE3Cs8Z8UnnPWTcw
