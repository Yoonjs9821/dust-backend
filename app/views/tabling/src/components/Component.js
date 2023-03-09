export default class Component {
    $list;
    $info;
    $modal;
    $modalBackdrop;
    state;
    constructor () {
        this.$list = document.querySelector('.reservationList');
        this.$info = document.querySelector('.reservationInfo');
        this.$modal = document.querySelector('.modal');
        this.$modalBackdrop = document.querySelector('.modalBackdrop');
        this.setEvent();
        this.listRender();
        this.infoRender();
    }

    setState (newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    setEventList () {
        this.$target.addEventListener('click', ({ target }) => {
            const items = [ ...this.state.items ];
      
            // 예약 상태 버튼
            if (target.classList.contains('statusBtn')) {
                if(target.classList.contains('in')){
                    // [착석] 버튼을 클릭하면, [퇴석]으로 버튼을 변경한다.
                    target.className = 'out btn';
                    target.innerText = '퇴석';
                } else if(target.classList.contains('out')){
                    // [퇴석] 버튼을 클릭하면, 예약 목록에서 제거한다.
                    this.setState({ items: [ ...items, items.filter(({id}) => id != target.parentNode.id)]});
                    listRender(items);
                    infoRender(items, 0);
                }
            }
      
            // 상세보기 버튼
            if (target.classList.contains('infoBtn')) {
                // Desktop, Mobile 구분
                if (matchMedia("screen and (min-width: 1024px)").matches) {
                    // 1024px 이상 Desktop
                    infoRender(items, index);
                } else {
                    // 1024px 미만 Mobile
                    modalRender(items, index);
                }
            }
      
        });
    }

    modalSetEvent () {

    }

    listRender () {
        const items = [ ...this.state.items ];
        let html = '';
        items.forEach(({customer, id, menus, status, tables, statusText, timeReservedText, buttonClass, buttonText}) => {
            // List item
            let item = "";

            // status가 done 이면 미표출
            if(!(status == "done")){
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
                        <button class="${buttonClass} btn">${buttonText}</button>
                    </li>
                `;
            }
            
            html += item;
        });

        this.$list.innerHTML = html;
        this.setEventList();
    }

    infoRender () {
        this.$info.innerHTML = this.infoTemplate();
        this.setEvent(); 
    }

    modalRender () {
        this.$modal.innerHTML = this.modalTemplate();
        this.setEvent(); 
    }
}