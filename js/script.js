const myUrl = 'https://friendly-trifle-ee6c52.netlify.app/top-headlines?country=kr';
const noonaUrl = 'http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines'
let newsList = [];

const getLatesNews = async () => {
  let url = new URL(myUrl);
  const requestUrl = new URL(url);
  console.log('uuu', requestUrl);

  const reponse = await fetch(requestUrl);
  const data = await reponse.json();
  console.log('rrr', reponse);
  newsList = data.articles;
  console.log('ddd', data);
  console.log('nnn', newsList);

  render();
};

const render = () => {
  const newsHTML = newsList.map(
    (news) =>
    `
    <div class="row news mx-auto">
    <div class="news-img col-lg-4 col-12 mx-auto">
      <img class="img-fluid mx-auto col-12" src="${news.urlToImage}" alt="뉴스 img">
    </div>
    <div class="col-lg-8">
      <h2 class="content-title">${news.title}</h2>
      <p class="content-txt">${news.description}</p>
      <div class="content-created">${news.source.name} * ${news.publishedAt}</div>
    </div>
  </div>
  `
  ).join('');

  console.log('html', newsHTML);

  document.getElementById('news-board').innerHTML = newsHTML;
}

getLatesNews();