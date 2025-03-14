const menuTabs = document.querySelectorAll('.menu-tab');
const mobileMenuTabs = document.querySelectorAll('.mobile-menu-tab');
const modal = document.querySelector('#modal');
//MODAL DATA
const productId = document.querySelector('#product_id');
const productName = document.querySelector('#product_name');
const productValue = document.querySelector('#product_value');
const closeModal = document.querySelector('#close_modal');
//////////////
const body = document.querySelector('body');
const productList = document.getElementById('product_list');
const productsCount = document.getElementById('count');
const hamburger = document.querySelector('.mobile-menu')
const mobileMenu = document.querySelector('#menu')

let dataIsLoading = false;
let canFetchMore = true;
let displayCount = productsCount.value;
let pageNumber = 1;
let apiUrl = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${displayCount}`

// SET ACTIVE TABS IN MENU
menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(item => item.classList.remove('active'))
    tab.classList.add('active')
  })
});

// INSERT PRODUCT TO PRODUCT LIST
const insertData = (productData) => {
  productData.forEach(data => {
    const product = document.createElement('div');
    product.textContent = `ID: ${data.id}`;
    product.classList.add('product')
    product.setAttribute('data-name', data.id);
    product.setAttribute('data-value', data.text);
    product.setAttribute('data-id', data.id);

    productList.appendChild(product)
  })
};

// ASSIGN DATA TO MODAL
const assignDataToModal = () => {
  const products = document.querySelectorAll('.product');
  products.forEach(product => {
    product.addEventListener('click', () => {
      modal.classList.add('open')
      body.style.overflow = 'hidden'
      productId.innerHTML = `ID ${product.dataset.id}`;
      productName.innerHTML = `Nazwa: ${product.dataset.name}`;
      productValue.innerHTML = `Wartość: ${product.dataset.value}`;
    })
  })
}

// FETCH DATA
const fetchData = async (url) => {
  try {
    if (!dataIsLoading && canFetchMore) {
      dataIsLoading = true;
      const response = await fetch(url);

      const data = await response.json();
      if (data.currentPage === data.totalPages) {
        canFetchMore = false;
      }
      insertData(data.data);
      assignDataToModal();
    }
  }
  catch (error) {
    throw new Error(error);
  }
  finally {
    dataIsLoading = false;
    pageNumber++;
  }
};

// CHANGE ELEMENTS PER PAGE
async function changeDisplayCount() {
  displayCount = productsCount.value;
  pageNumber = 1;
  apiUrl = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${displayCount}`;
  productList.innerHTML = ''
  await fetchData(apiUrl)
}

// CLOSE MODAL AND CHANGE OVERFLOW TO AUTO - CLOSE AFTER CLICK ON THE OUTSIDE MODAL
modal.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
        modal.classList.remove('open')
        body.style.overflow = 'auto'
    }
},)

// CLOSE MODAL AND CHANGE OVERFLOW TO AUTO - CLOSE AFTER CLICK ON THE CROSS
closeModal.addEventListener('click', () => {
  modal.classList.remove('open');
  body.style.overflow = 'auto'
})

// LOAD MORE
document.addEventListener('scroll', async (e) => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if( (scrollTop + clientHeight) > (scrollHeight - 5)){
    apiUrl = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${displayCount}`;
   await fetchData(apiUrl);
  }
});

// EVENT FOR CHANGE ELEMENTS PER PAGE
productsCount.addEventListener('change', changeDisplayCount);

// LOAD DATA
document.addEventListener('DOMContentLoaded', async () => {
 await fetchData(apiUrl);
})

// MOBILE MENU

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open-mobile-menu')
  if (mobileMenu.classList.contains('open-mobile-menu')) {
    body.style.overflow = 'hidden'
  } else {
    body.style.overflow = 'auto'
  }
});

// CLOSE MENU AND CHANGE OVERFLOW TO AUTO - CLOSE AFTER CLICK ON THE OUTSIDE MODAL
mobileMenu.addEventListener('click', (e) => {
  if (e.target.id === 'menu') {
    mobileMenu.classList.remove('open-mobile-menu')
    body.style.overflow = 'auto'
  }
},)

//SELECT MOBILE MENU OPTIONS

mobileMenuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    mobileMenu.classList.remove('open-mobile-menu')
    body.style.overflow = 'auto'
  })
});


