class Items{
  $list = document.querySelector('.reservationList');
  $info = document.querySelector('.reservationInfo');
  $modal = document.querySelector('.modal');
  $modalBackdrop = document.querySelector('.modalBackdrop');
  state;
  constructor () {
    this.setup();
    this.callApi();
    this.setState();
  }
  setup () {
    this.state = { items: [] };
  }
  setState(newState){
    this.state.items = newState;
  }

  callApi () {
      const initData = (array) => {
        let list = [];
        array.forEach((data) => {
          // 시간은 HH:mm 형식으로 표출 해주세요
          let timeReservedText = new Date(data.timeReserved).getHours() 
                      + ':' + (new Date(data.timeReserved).getMinutes()<10?'0':'')
                      + new Date(data.timeReserved).getMinutes();
          data.timeReservedText = timeReservedText;
  
          // reserved는 “예약", seated는 “착석 중”, button class 구분
          let statusText,buttonText,buttonClass = "";
          switch (data.status) {
              case 'reserved':
                  statusText = "예약";
                  buttonText = "착석";
                  buttonClass = "in"
                  break;
              case 'seated':
                  statusText = "착석 중";
                  buttonText = "퇴석";
                  buttonClass = "out";
                  break;
          }
          data.statusText = statusText;
          data.buttonText = buttonText;
          data.buttonClass = buttonClass;
  
          // status가 done 이면 미표출
          if(!(data.status == "done")){
            list.push(data);
          }
        });
        this.setState(list);
        this.listRender();
        this.infoRender(0);
        this.modalRender(0);
        this.setEventList();
        this.setEventinfo();
        this.setEventModal();
      }

      // frontend.tabling.co.kr Call API
      const request = async (url) => {
          try {
              const response = await fetch(url);
              if (response.ok) {
                  const data = await response.json();
                  return data;
              } else {
                  const errorData = await response.json();
                  throw errorData;
              }
          } catch (e) {
              throw {
                  message: e.message,
                  status: e.status,
              };
          }
      };
      const api = {
          reservations: async () => {
              try {
                  const result = await request(
                      "https://frontend.tabling.co.kr/v1/store/9533/reservations"
                  );

                  initData(result.reservations)
              } catch (e) {
                  return {
                      isError: true,
                      data: e.message,
                  };
              }
          },
      };
      api.reservations();
  }

  listRender () {
    const items = [ ...this.state.items ];
    
    let html = '';
    items.forEach(({customer, id, menus, status, tables, statusText, timeReservedText, buttonClass, buttonText}) => {
        // List item
        let item = "";

        item = `
                <li id="${id}" class="targetReservation">
                    <div>
                        <p>${timeReservedText} <br/> ${statusText}</p>
                    </div>
                    <div>
                        <p>${customer.name} - 테이블명 [${tables.map(table => `${table.name}`)}]</p>
                        <p>성인 <span>${customer.adult}</span> 아이 <span>${customer.child}</span></p>
                        <p>메뉴명(갯수) [${menus.map(menu => `${menu.name} (${menu.qty})`)}]</p>
                    </div>
                    <button class="${buttonClass} statusBtn">${buttonText}</button>
                </li>
            `;
        
        html += item;
    });

    this.$list.innerHTML = html;

    const me = this;
    // 상세보기
    const targetReservation = me.$list.querySelectorAll('.targetReservation');
    targetReservation.forEach(function(target, index){        
        target.addEventListener('click', (e) => {
            if (!e.target.classList.contains('statusBtn')){
                // Desktop, Mobile 구분
                if (matchMedia("screen and (min-width: 1024px)").matches) {
                    // 1024px 이상 Desktop
                    me.infoRender(index);
                } else {
                    // 1024px 미만 Mobile
                    me.modalRender(index);
                    me.$modal.classList.add("active");
                    me.$modalBackdrop.classList.add("active");
                }
            }
        })
    });
  }

  infoRender (index) {
    const items = [ ...this.state.items ];
    
    if(items.length < 1) {
      this.$info.innerHTML = ""; 
      this.$info.style.display = 'none';
      return;
    }

    let html = `
            <h3>예약 정보</h3>
            <dl>
                <dt>예약 상태</dt>
                <dd>${items[index].statusText}</dd>
            </dl>
            <dl>
                <dt>예약 시간</dt>
                <dd>${items[index].timeReserved}</dd>
            </dl>
            <dl>
                <dt>접수 시간</dt>
                <dd>${items[index].timeRegistered}</dd>
            </dl>

            <h3>고객 정보</h3>
            <dl>
                <dt>고객 성명</dt>
                <dd>${items[index].customer.name}</dd>
            </dl>
            <dl>
                <dt>고객 등급</dt>
                <dd>${items[index].customer.level}</dd>
            </dl>
            <dl>
                <dt>고객 메모</dt>
                <dd>${items[index].customer.memo}</dd>
            </dl>
            <dl>
                <dt>요청사항</dt>
                <dd>${items[index].customer.request}</dd>
            </dl>
    `;

    this.$info.innerHTML = html;
  }

  modalRender (index) {
    const items = [ ...this.state.items ];
    
    if(items.length < 1) {
      this.$modal.style.display = 'none';
      this.$modalBackdrop.style.display = 'none';
      return;
    }

    let html = `
            <div>
                <h3>예약 정보</h3><button class="modalClose">닫기</button>
            </div>
            <div>
                <dl>
                    <dt>예약 상태</dt>
                    <dd>${items[index].statusText}</dd>
                </dl>
                <dl>
                    <dt>예약 시간</dt>
                    <dd>${items[index].timeReserved}</dd>
                </dl>
                <dl>
                    <dt>접수 시간</dt>
                    <dd>${items[index].timeRegistered}</dd>
                </dl>

                <h3>고객 정보</h3>
                <dl>
                    <dt>고객 성명</dt>
                    <dd>${items[index].customer.name}</dd>
                </dl>
                <dl>
                    <dt>고객 등급</dt>
                    <dd>${items[index].customer.level}</dd>
                </dl>
                <dl>
                    <dt>고객 메모</dt>
                    <dd>${items[index].customer.memo}</dd>
                </dl>
                <dl>
                    <dt>요청사항</dt>
                    <dd>${items[index].customer.request}</dd>
                </dl>
            </div>
    `;
    
    this.$modal.innerHTML = html;
  }

  // 이벤트 처리
  setEventList () {
    const me = this;
    
    me.$list.addEventListener('click', ({ target }) => {
      const items = [ ...this.state.items ];

      // 예약 상태 버튼
      if (target.classList.contains('statusBtn')) {
        if(target.classList.contains('in')){
            // [착석] 버튼을 클릭하면, [퇴석]으로 버튼을 변경한다.
            target.className = 'out statusBtn';
            target.innerText = '퇴석';
        } else if(target.classList.contains('out')){
            // [퇴석] 버튼을 클릭하면, 예약 목록에서 제거한다.
            this.setState(items.filter(({id}) => id != target.parentNode.id));
            this.listRender();
            this.infoRender(0);
            this.modalRender(0);
        }
      } 
    });
  }
  setEventinfo () {

  }
  setEventModal () {
    const me = this;

    me.$modalBackdrop.addEventListener('click', (e) => {
        this.$modal.classList.remove("active");
        this.$modalBackdrop.classList.remove("active");
    });

    me.$modal.addEventListener('click', ({ target }) => {
      // 예약 상태 버튼
      if (target.classList.contains('modalClose')) {
        this.$modal.classList.remove("active");
        this.$modalBackdrop.classList.remove("active");
      } 
    });
  }
}

class App {
  constructor () {
    const $app = document.querySelector('#app');
    $app.innerHTML = this.appTemplate();
    new Items($app);
  }
  appTemplate () {
      return `
          <header class="header">
          <h1 class="title">예약 목록</h1>
          </header>
          <div class="content">
              <ul class="reservationList">
                  
              </ul>
              <div class="reservationInfo">
                  
              </div>
          </div>
          <div class="modal">
              
          </div>
          <div class="modalBackdrop"></div>
      `
  }
}
new App();