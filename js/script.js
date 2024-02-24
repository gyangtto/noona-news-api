// 초기 설정
const myUrl = 'https://friendly-trifle-ee6c52.netlify.app/top-headlines?country=kr';
let newsList = [];
// url 초기화 전역변수로 선언
let url = new URL(`${myUrl}`);

// 메뉴 및 모바일 메뉴 선택
const menus = document.querySelectorAll('.menus button');
const mobileMenus = document.querySelectorAll('#menu-list button');

// 검색 선택
const inputArea = document.getElementById('input-area');
const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// 페이지네이션
// 페이지네이션 값 정하기
let totalResults = 0; // 기본값 = 0; 전역 변수 선언
// 임의적으로 정해줄 수 있음
let page = 1;
let pageSize = 10; // 고정 값
let groupSize = 5; // 고정 값


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

// 중복 코드 방지
const getNews = async () => {
  try {
    // url 뒤에다 붙여줄 수 있는 함수 = searchParams
    url.searchParams.set('page',page); // -> &page=page
    url.searchParams.set('pageSize',pageSize) // -> &pageSize=pageSize
    // fetch 전 searchParams 진행

    const response = await fetch(url);
    const data = await response.json();  // 응답 데이터를 구문 분석
    // console.log('rrr', response); // response 확인

    if (response.status === 200) { // 정상일 경우 렌더링
      if (data.articles.length === 0) { // 정상이지만 검색 후 article 갯수가 0개 일 때
        throw new Error('검색 결과가 없습니다.');
      }
      newsList = data.articles;
      // console.log('ddd', newsList); // 데이터 확인
      totalResults = data.totalResults; // 데이터의 totalResults 값
      render();
      paginationRender(); // 페이지네이션 렌더링 추가
    } else {
      throw new Error(data.message);  // 오류 메시지에 적절한 속성을 사용합니다.
    }
  } catch (error) {
      // console.log('error', error.message); // 트라이캐치 함수 정상여부 확인
    errorRender(error.message);
  }
};


// 최신 뉴스 가져오기
const getLatestNews = async () => {
  url = new URL (`${myUrl}`)
    getNews();
};

// 카테고리별 뉴스 가져오기
const getNewsByCategory = async (evt) => {
  const category = evt.target.textContent.toLowerCase();
  url = new URL(`${myUrl}&category=${category}`);
  getNews();
};

// 검색 박스 열기/닫기
const openSearchBox = () => {
  if (inputArea.style.display === 'flex') {
    inputArea.style.display = 'none';
  } else {
    inputArea.style.display = 'flex';
    searchIcon.style.display = 'none';
    searchInput.focus();
    // 검색 내용 초기화
    searchInput.value = '';
  }
};

// 검색 버튼 클릭 이벤트 추가 포커스 해제 이벤트 처리로 인한 onclick 제거 및 click 이벤트 추가
searchBtn.addEventListener('click', (event) => {
  // 검색 버튼을 누르면 검색 실행
  handleSearch(); 
});

// 검색 입력창에 enter 키 이벤트 추가
searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    // 엔터 키를 누르면 검색 실행
    handleSearch();
  }
});

// ESC 키를 눌렀을 때 검색창 닫기
document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    inputArea.style.display = 'none';
    searchIcon.style.display = 'block';
  }
});

// #search-input에서 포커스가 해제될 때 이벤트 처리
searchInput.addEventListener('blur', () => {
  setTimeout(() => {
    // #search-input이 포커스를 잃으면 input 영역을 숨기고 mobile-gnb-btn을 보이게 함
    inputArea.style.display = 'none';
    searchIcon.style.display = 'block';
  }, 600)
});

// 키워드로 뉴스 가져오기
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  // console.log('keyword', keyword);
    url = new URL(`${myUrl}&q=${keyword}`);
    getNews();
};

// handleSearch() 함수 추가
const handleSearch = () => {
  // 검색 이벤트를 통합적으로 처리
  getNewsByKeyword();
};

// 뉴스 렌더링
const render = () => {
  const newsHTML = newsList.map((news) => `
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
        <div class="content-created">${news.source.name} * ${news.publishedAt || "no source"}  ${moment(news.published_date).fromNow()}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('news-board').innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `
  <div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;

  document.getElementById('news-board').innerHTML = errorHTML;
};


const paginationRender = () => {
  // totalResults
  // let totalResults = 0; // 기본값 = 0; 전역 변수 선언
  // 임의적으로 정해줄 수 있음
  // page
  // let page = 1;
  // pageSize
  // let pageSize = 10; // 고정 값
  // groupSize
  // let groupSize = 5; // 고정 값
  // 임의적으로 정해줄 수 있음
  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = pageGroup * groupSize;
  // 마지막페이지가 그룹사이즈보다 작을 경우 -> lastPage = totalPages
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  // firstPage
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1); // 첫번째 페이지그룹이 <=0 일 경우

  // first ~ last Page 그려주기
  let paginationHTML = `
  <li class="page-item ${page === 1 ? 'disabled' : ''}" onclick="moveToPage(1)">
  <a class="page-link">&lt;&lt;</a>
</li>
<li class="page-item ${page === 1 ? 'disabled' : ''}" onclick="moveToPage(${page - 1})"><a class="page-link" ${page === 1 ? 'style="pointer-events: none; cursor: default;"' : ''}>이전</a></li>`;
  for (let i = firstPage; i <= lastPage; i++) {
    // 활성 페이지에 대한 클래스 추가
    paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }
  paginationHTML += `
  <li class="page-item ${page === totalPages ? 'disabled' : ''}" onclick="moveToPage(${page + 1})"><a class="page-link" ${page === totalPages ? 'style="pointer-events: none; cursor: default;"' : ''}>다음</a></li>
  <li class="page-item ${page === totalPages ? 'disabled' : ''}" onclick="moveToPage(${totalPages})">
    <a class="page-link">&gt;&gt;</a>
  </li>`;
  document.querySelector('.pagination').innerHTML = paginationHTML;


  //   <div arialabel='Page navigation exmple'>
  //   <ul class='pagination'>
  //   <li class="page-item"><a href="#" class="page-link">prev</a></li>
  //       <li class="page-item"><a href="#" class="page-link">1</a></li>
  //       <li class="page-item"><a href="#" class="page-link">2</a></li>
  //       <li class="page-item"><a href="#" class="page-link">3</a></li>
  //       <li class="page-item"><a href="#" class="page-link">4</a></li>
  //       <li class="page-item"><a href="#" class="page-link">5</a></li>
  //       <li class="page-item"><a href="#" class="page-link">next</a></li>
  //   </ul>
  // </div> // li 제외 html에 작성
}

const moveToPage = (pageNum) => {
  if (pageNum >= 1 && pageNum <= Math.ceil(totalResults / pageSize)) {
    console.log('move to page', pageNum);
    page = pageNum;
    getNews();
  }
}

// 초기 뉴스 로딩
getLatestNews();

// top 버튼
window.addEventListener('scroll', function() {
  var topButton = document.getElementById('top_btn');

  if (window.scrollY > 100) {
    topButton.classList.add('on');
  } else {
    topButton.classList.remove('on');
  }
});

document.getElementById('top_btn').addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// 에러 핸들링 추가
// try-catch 블록을 사용하여 비동기 함수 (getLatestNews, getNewsByCategory, getNewsByKeyword)에서 발생할 수 있는 에러를 처리
// 에러가 발생한 경우, 콘솔에 에러 메시지를 출력하고 사용자에게 에러가 발생했음 콘솔 확인

// 함수 이름 수정
// render 함수 내부에서 news.published_date를 사용 
// published_date는 보통 사용되지 않으므로 publishedAt을 사용하는 것이 더 일반적인 점으로 수정

// 이미지 로딩에 대한 처리에서 onerror 이벤트를 사용하여 이미지 로딩이 실패했을 때 대체 이미지를 표시하도록 수정
// async () => {} ~  getNews () 함수로 통일

// handleSearch() 함수 추가
// handleSearch() 함수는 검색 관련 이벤트들을 통합하여 처리하는 역할을 하고, 실제 검색 기능은 getNewsByKeyword() 함수에서 실행 됨
// ESC 키를 눌렀을 때 검색창 닫기 내용 추가

// try-catch 위치 getNews() 함수내에서 작동될 수 있도록 수정
// 에러 화면 내용 추가 구성

// 페이지네이션 추가구성
// totalResults
// page
// pageSize
// groupSize
// lastPage
// firstPage 

// 여기서 문제
// 1페이지에서 이전 버튼 클릭 시 검색결과가 없습니다 확인됨 / 1페이지일 경우 이전 버튼 disabled처리 필요
// 마지막 페이지에서 다음 버튼 클릭 시 검색결과가 없습니다 확인됨 / 마지막페이지일 경우 다음 버튼 disabled 처리 필요