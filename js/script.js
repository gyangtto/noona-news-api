const myUrl = 'https://friendly-trifle-ee6c52.netlify.app/top-headlines?country=kr';
const noonaUrl = 'http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines'
let newsList = [];
const menus = document.querySelectorAll('.menus button');
// console.log('button :', menus); // 버튼들 확인
const mobileMenus = document.querySelectorAll('#menu-list button')
console.log('button :', mobileMenus); // 버튼들 확인

// 모바일 햄버거 메뉴열기
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

// 모바일 햄버거 메뉴닫기
const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

mobileMenus.forEach(menu => menu.addEventListener('click', (evt) => getNewsByCategory(evt)));

menus.forEach(menu => menu.addEventListener('click', (evt) => getNewsByCategory(evt)));

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

const getNewsByCategory = async (evt) => {
  const category = evt.target.textContent.toLowerCase();
  console.log('category', category); // 카테고리 클릭 이벤트 확인
  const url = new URL(
    `${myUrl}&category=${category}`
  );

  const reponse = await fetch(url);;
  console.log('rrr', reponse);
  const data = await reponse.json();
  newsList = data.articles;
  console.log('ddd', data);

  render();
};

const openSearchBox = () => {
  let inputArea = document.getElementById('input-area');

  if (inputArea.style.display === 'flex') {
    inputArea.style.display = 'none';
  } else {
    inputArea.style.display = 'flex';
    document.getElementById('search-icon').style.display = 'none';
    document.getElementById('search-input').focus()
  }
};

// #search-input에서 포커스가 해제될 때 이벤트 처리
document.getElementById('search-input').addEventListener('blur', () => {
  let inputArea = document.getElementById('input-area');
  // #search-input이 포커스를 잃으면 input 영역을 숨기고 mobile-gnb-btn을 보이게 함
  inputArea.style.display = 'none';
  document.getElementById('search-icon').style.display = 'block';
});

const getNewsByKeyword = async () => {
  const keyword = document.getElementById('search-input').value;
  console.log('keyword', keyword);

  const url = new URL(
    `${myUrl}&q=${keyword}&apiKey=${API_KEY}`
  );
  const reponse = await fetch(url);
  console.log('rrr', reponse);
  const data = await reponse.json();
  newsList = data.articles;
  console.log('ddd', newsList);

  render();
};

const render = () => {
  const newsHTML = newsList.map(
    (news) =>
    `
    <div class="row news mx-auto">
    <div class="news-img col-lg-4 col-12 mx-auto">
    <img class="img-fluid mx-auto col-12" 
      src="${news.urlToImage}" 
      onerror="this.onerror=null;this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';" 
      alt="뉴스 img">
    </div>
    <div class="col-lg-8">
      <h2 class="content-title">${news.title}</h2>
      <p class="content-txt">${news.description == null || news.description == ""
      ? "내용없음"
      : news.description.length > 200
      ? news.description.substring(0, 200) + "..."
      : news.description
}</p>
      <div class="content-created">${news.source.name} * ${news.publishedAt || "no source"}  ${moment(
        news.published_date
      ).fromNow()}</div>
    </div>
  </div>
  `
  ).join('');
  // console.log('html', newsHTML); // html 확인

  document.getElementById('news-board').innerHTML = newsHTML;
}

getLatesNews();