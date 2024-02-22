let newsList = [];

// 모바일 및 데스크톱 메뉴 통합: 
// 모바일 및 데스크톱 메뉴의 기능이 유사하므로 하나의 이벤트 리스너로 처리합니다.
const menus = document.querySelectorAll('.menus button, #menu-list button');


// 모바일 사이드 메뉴 evt
const openNav = () => {
  document.getElementById('mySidenav').style.width = '250px';
};

const closeNav = () => {
  document.getElementById('mySidenav').style.width = '0';
};

// 구조 분해 사용: 
// 이벤트 리스너에서 evt 객체를 구조 분해, target.textContent에 직접 액세스
// 클릭 이벤트 리스너를 사용하여 모든 메뉴에 동일한 처리기를 할당
menus.forEach(menu => menu.addEventListener('click', getNewsByCategory));

// 검색 상자 포커스 해제 시 closeSearchBox 이벤트 리스너를 추가
document.getElementById('search-input').addEventListener('blur', closeSearchBox);

// 검색 input 열고 닫기
// HTML을 위한 템플릿 리터럴 사용: 
// HTML 문자열을 생성할 때 템플릿 리터럴을 사용
const openSearchBox = () => {
  const inputArea = document.getElementById('input-area');
  inputArea.style.display = inputArea.style.display === 'flex' ? 'none' : 'flex';
  document.getElementById('search-icon').style.display = 'none';
  document.getElementById('search-input').focus();
};

// 검색 상자 포커스 해제 시 evt
// 반복되는 코드 피하기: 
// URL 구축 프로세스의 공통 부분을 buildUrl 함수로 분리
const closeSearchBox = () => {
  const inputArea = document.getElementById('input-area');
  inputArea.style.display = 'none';
  document.getElementById('search-icon').style.display = 'block';
};

// 최신 뉴스를 가져오는 함수
const getLatesNews = async () => {
  const url = buildUrl('top-headlines', {
    country: 'kr'
  });
  const data = await fetchData(url);
  newsList = data.articles;
  render();
};

// 카테고리에 따라 뉴스를 가져오는 함수
const getNewsByCategory = async (evt) => {
  const category = evt.target.textContent.toLowerCase();
  const url = buildUrl('top-headlines', {
    country: 'kr',
    category
  });
  const data = await fetchData(url);
  newsList = data.articles;
  render();
};

// 키워드에 따라 뉴스를 가져오는 함수
const getNewsByKeyword = async () => {
  const keyword = document.getElementById('search-input').value;
  const url = buildUrl('top-headlines', {
    country: 'kr',
    q: keyword
  });
  const data = await fetchData(url);
  newsList = data.articles;
  render();
};

// API 요청을 빌드하는 함수
const buildUrl = (endpoint, params) => {
  const url = new URL(`https://newsapi.org/v2/${endpoint}`);
  url.searchParams.append('apiKey', API_KEY);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  return url;
};

// 데이터를 가져오는 함수
// 선택적 체이닝 사용: 
// 속성이 null 또는 정의되지 않을 수 있는 경우 선택적 체이닝을 사용
const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// 뉴스를 화면에 렌더링하는 함수
const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `
      <div class="row news mx-auto">
        <div class="news-img col-lg-4 col-12 mx-auto">
          <img class="img-fluid mx-auto col-12" src="${news.urlToImage || 'https://...'}" alt="뉴스 img">
        </div>
        <div class="col-lg-8">
          <h2 class="content-title">${news.title}</h2>
          <p class="content-txt">${news.description ?? '내용없음'}</p>
          <div class="content-created">${news.source?.name} * ${news.publishedAt || 'no source'} ${moment(
            news.published_date
          ).fromNow()}</div>
        </div>
      </div>`
    )
    .join('');

  document.getElementById('news-board').innerHTML = newsHTML;
};

//화면에 렌더링
getLatesNews();

// 모바일 및 데스크톱 메뉴 통합:
// 구조 분해 사용:
// HTML을 위한 템플릿 리터럴 사용:
// 반복되는 코드 피하기:
// 선택적 체이닝 사용: