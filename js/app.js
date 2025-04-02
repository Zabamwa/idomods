const elements = {
  menuTabs: document.querySelectorAll('.menu-tab a'),
  mobileMenuTabs: document.querySelectorAll('.mobile-menu-tab'),
  modal: document.querySelector('#modal'),
  productId: document.querySelector('#product_id'),
  productName: document.querySelector('#product_name'),
  productValue: document.querySelector('#product_value'),
  closeModal: document.querySelector('#close_modal'),
  body: document.querySelector('body'),
  productList: document.getElementById('product_list'),
  productsCount: document.getElementById('count'),
  hamburger: document.querySelector('.mobile-menu'),
  mobileMenu: document.querySelector('#menu')
};

let dataIsLoading = false;
let canFetchMore = true;
let pageNumber = 1;
let apiUrl = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${elements.productsCount.value}`


//SET ACTIVE TAB
const setActiveTab = (tabs) => {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
    });
  });
};

setActiveTab(elements.menuTabs);
setActiveTab(elements.mobileMenuTabs);

// FETCH DATA
const fetchData = async (url) => {
  if (dataIsLoading || !canFetchMore) return;
  try {
    dataIsLoading = true;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Błąd pobierania danych", response.status);
      return;
    }
    const data = await response.json();
    if (data.currentPage === data.totalPages) {
      canFetchMore = false;
    }
    renderProducts(data.data);
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  } finally {
    dataIsLoading = false;
    pageNumber++;
  }
};

//OPEN MODAL
elements.productList.addEventListener('click', (e) => {
  const product = e.target.closest('.product');
  if (!product) return;

  elements.modal.classList.add('open');
  elements.body.style.overflow = 'hidden';
  elements.productId.innerHTML = `ID ${product.dataset.id}`;
  elements.productName.innerHTML = `Nazwa: ${product.dataset.name}`;
  elements.productValue.innerHTML = `Wartość: ${product.dataset.value}`;
});

//CLOSE MODAL
const closeModalHandler = (e) => {
  if (e.target.id === 'modal' || e.target.id === 'close_modal') {
    elements.modal.classList.remove('open');
    elements.body.style.overflow = 'auto';
  }
};

elements.modal.addEventListener('click', closeModalHandler);
elements.closeModal.addEventListener('click', closeModalHandler);

//OPEN MOBILE MENU
elements.hamburger.addEventListener('click', () => {
  elements.mobileMenu.classList.toggle('open-mobile-menu');
  elements.body.style.overflow = elements.mobileMenu.classList.contains('open-mobile-menu') ? 'hidden' : 'auto';
});

//CLOSE MOBILE MENU
elements.mobileMenu.addEventListener('click', (e) => {
  const clickedTab = e.target.closest('.mobile-menu-tab a');

  if (e.target.id === 'menu') {
    elements.mobileMenu.classList.remove('open-mobile-menu');
    elements.body.style.overflow = 'auto';
    return;
  }

  if (clickedTab) {
    elements.mobileMenu.classList.remove('open-mobile-menu');
    elements.body.style.overflow = 'auto';

    const targetTab = document.querySelector(`.menu-tab a[href="${clickedTab.getAttribute('href')}"]`);
    if (targetTab) {
      elements.menuTabs.forEach(tab => tab.classList.remove('active'));
      targetTab.classList.add('active');
    }
  }
});

// INSERT DATA
const renderProducts = (products) => {
  const fragment = document.createDocumentFragment();
  products.forEach(({ id, text }) => {
    const product = document.createElement('div');
    product.textContent = `ID: ${id}`;
    product.classList.add('product');
    product.dataset.name = id;
    product.dataset.value = text;
    product.dataset.id = id;

    fragment.appendChild(product);
  });
  elements.productList.appendChild(fragment);
};

// LOAD MORE
document.addEventListener('scroll', async () => {
  const scrollHeight = window.innerHeight;
  const pageY = window.scrollY
  const bodyOffsetHeight = document.body.offsetHeight;

  if(scrollHeight + pageY >= bodyOffsetHeight - 10 && !dataIsLoading){
    apiUrl = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${elements.productsCount.value}`;
   await fetchData(apiUrl);
  }
});

// CHANGE ELEMENTS PER PAGE
async function changeDisplayCount() {
  const displayCount = elements.productsCount.value;
  pageNumber = 1;
  apiUrl = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${Number(displayCount)}`;
  elements.productList.innerHTML = ''
  await fetchData(apiUrl)
}

// EVENT FOR CHANGE ELEMENTS PER PAGE
elements.productsCount.addEventListener('change', changeDisplayCount);

// LOAD DATA
document.addEventListener('DOMContentLoaded', async () => {
 await fetchData(apiUrl);
})

// SET ACTIVE TAB DURING SCROLLING
const updateActiveTab = () => {
  const sections = document.querySelectorAll("section");
  const tabs = document.querySelectorAll("nav ul li a");
  let currentSection = null;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      currentSection = section;
    }
  });

  if (currentSection) {
    tabs.forEach((tab) => tab.classList.remove("active"));
    const activeTab = document.querySelector(`nav ul li a[href="#${currentSection.id}"]`);
    if (activeTab) {
      activeTab.classList.add("active");
    }
  }
}

window.addEventListener("scroll", updateActiveTab);
