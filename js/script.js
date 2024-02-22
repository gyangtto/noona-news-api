// 초기 설정
const myUrl = 'https://friendly-trifle-ee6c52.netlify.app/top-headlines?country=kr';
let newsList = [];

const inputArea = document.getElementById('input-area');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// 메뉴 및 모바일 메뉴 선택
const menus = document.querySelectorAll('.menus button');
const mobileMenus = document.querySelectorAll('#menu-list button');

// 모바일 햄버거 메뉴 열기
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

// 모바일 햄버거 메뉴 닫기
const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

// 각 메뉴에 클릭 이벤트 추가
mobileMenus.forEach(menu => menu.addEventListener('click', (evt) => getNewsByCategory(evt)));
menus.forEach(menu => menu.addEventListener('click', (evt) => getNewsByCategory(evt)));

// 최신 뉴스 가져오기
const getLatestNews = async () => {
  try {
    const response = await fetch(myUrl);
    const data = await response.json();
    newsList = data.articles;
    render();
  } catch (error) {
    console.error('Error fetching latest news:', error);
  }
};

// 카테고리별 뉴스 가져오기
const getNewsByCategory = async (evt) => {
  const category = evt.target.textContent.toLowerCase();
  try {
    const url = new URL(`${myUrl}&category=${category}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
  } catch (error) {
    console.error(`Error fetching news for category '${category}':`, error);
  }
};

// 검색 박스 열기/닫기
const openSearchBox = () => {
  if (inputArea.style.display === 'flex') {
    inputArea.style.display = 'none';
  } else {
    inputArea.style.display = 'flex';
    document.getElementById('search-icon').style.display = 'none';
    searchInput.focus();
  }
};

// 검색 입력창 포커스 해제 이벤트 처리
searchInput.addEventListener('blur', () => {
  getNewsByKeyword();

  setTimeout(() => {
    const inputArea = document.getElementById('input-area');
    // 포커스가 해제되면 입력 영역을 숨기고 검색 아이콘을 다시 표시
    inputArea.style.display = 'none';
    document.getElementById('search-icon').style.display = 'block';
    searchInput.value='';
  },500)
});

// 검색 버튼 클릭 이벤트 추가
searchBtn.addEventListener('click', (event) => {
  // 검색 버튼을 누르면 검색 실행
  getNewsByKeyword();
  // 입력 창에서 포커스 해제 방지
  event.preventDefault();
});


// 검색 입력창에 엔터 키 이벤트 추가
searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    // 엔터 키를 누르면 검색 실행
    getNewsByKeyword();
  }
});

// 키워드로 뉴스 가져오기
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  console.log('keyword', keyword);
  try {
    const url = new URL(`${myUrl}&q=${keyword}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;

    render();
  } catch (error) {
    console.error('Error fetching news by keyword:', error);
  }
};


// 뉴스 렌더링
const render = () => {
  const newsHTML = newsList.map((news) => `
    <div class="row news mx-auto">
      <div class="news-img col-lg-4 col-12 mx-auto">
        <img class="img-fluid mx-auto col-12" 
          src="${news.urlToImage}" 
          onerror="this.onerror=null;this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';" 
          alt="뉴스 img" />
      </div>
      <div class="col-lg-8">
        <h2 class="content-title mt-2 mt-lg-0">${news.title}</h2>
        <p class="content-txt">${news.description == null || news.description == ""
          ? "내용없음"
          : news.description.length > 200
          ? news.description.substring(0, 200) + "..."
          : news.description
        }</p>
        <div class="content-created">${news.source.name} * ${news.publishedAt || "no source"}  ${moment(news.published_date).fromNow()}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('news-board').innerHTML = newsHTML;
};

// 초기 뉴스 로딩
getLatestNews();

// 에러 핸들링 추가
// try-catch 블록을 사용하여 비동기 함수 (getLatestNews, getNewsByCategory, getNewsByKeyword)에서 발생할 수 있는 에러를 처리
// 에러가 발생한 경우, 콘솔에 에러 메시지를 출력하고 사용자에게 에러가 발생했음 콘솔 확인

// 함수 이름 수정
// render 함수 내부에서 news.published_date를 사용 
// published_date는 보통 사용되지 않으므로 publishedAt을 사용하는 것이 더 일반적인 점으로 수정

// 이미지 로딩에 대한 처리에서 onerror 이벤트를 사용하여 이미지 로딩이 실패했을 때 대체 이미지를 표시하도록 수정