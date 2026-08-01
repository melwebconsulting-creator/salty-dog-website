/**
 * SALTY DOG — MODERN AMERICAN SOUL FOOD (BOSTON EDGE • MAKATI)
 * Vanilla JavaScript Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. AMBIENT SPOTLIGHT FOLLOW MOUSE
     -------------------------------------------------------------------------- */
  const spotlight = document.getElementById('ambient-spotlight');
  if (spotlight && window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateSpotlight() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      spotlight.style.left = `${currentX}px`;
      spotlight.style.top = `${currentY}px`;
      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  }

  /* --------------------------------------------------------------------------
     2. STICKY HEADER & SCROLL STATE
     -------------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* --------------------------------------------------------------------------
     3. MOBILE NAVIGATION MENU OVERLAY
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileClose = document.getElementById('mobileClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle && mobileClose && mobileMenu) {
    mobileToggle.addEventListener('click', openMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* --------------------------------------------------------------------------
     4. CATEGORY FILTERING FOR TODAY'S FAVORITES
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const foodCards = document.querySelectorAll('.food-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      foodCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (btn.classList.contains('active') && btn.dataset.category !== 'all' && card.dataset.category !== category) {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     5. INTERACTIVE TASTING DRAWER & SELECTION SYSTEM
     -------------------------------------------------------------------------- */
  const tastingDrawer = document.getElementById('tastingDrawer');
  const tastingCountEl = document.getElementById('tastingCount');
  const tastingItemsList = document.getElementById('tastingItemsList');
  const tastingTotalEst = document.getElementById('tastingTotalEst');
  const clearTastingBtn = document.getElementById('clearTastingBtn');

  let selectedDishes = [];

  window.toggleDishOrder = function(dishName, priceStr) {
    const price = parseInt(priceStr, 10);
    const existingIndex = selectedDishes.findIndex(item => item.name === dishName);

    if (existingIndex > -1) {
      selectedDishes.splice(existingIndex, 1);
    } else {
      selectedDishes.push({ name: dishName, price: price });
    }

    updateTastingDrawerUI();
  };

  function updateTastingDrawerUI() {
    if (selectedDishes.length === 0) {
      tastingCountEl.textContent = '0 items selected';
      tastingItemsList.innerHTML = '<span class="empty-list-txt">Click "+ Add to Tasting" on any dish above to curate your meal experience.</span>';
      tastingTotalEst.textContent = 'Est. Total: ₱0';
      return;
    }

    tastingCountEl.textContent = `${selectedDishes.length} dish${selectedDishes.length > 1 ? 'es' : ''} selected`;
    tastingItemsList.innerHTML = selectedDishes.map(item => `
      <span class="drawer-chip">${item.name} (₱${item.price.toLocaleString()})</span>
    `).join('');

    const total = selectedDishes.reduce((sum, item) => sum + item.price, 0);
    tastingTotalEst.textContent = `Est. Total: ₱${total.toLocaleString()}`;
  }

  if (clearTastingBtn) {
    clearTastingBtn.addEventListener('click', () => {
      selectedDishes = [];
      updateTastingDrawerUI();
    });
  }

  window.applyTastingToReservation = function() {
    if (selectedDishes.length > 0) {
      const notesInput = document.getElementById('resNotes');
      if (notesInput) {
        const dishNames = selectedDishes.map(d => d.name).join(', ');
        notesInput.value = `Pre-selected tasting items: ${dishNames}.`;
      }
    }
  };

  /* --------------------------------------------------------------------------
     6. QUICK TASTE MODAL INSPECTOR
     -------------------------------------------------------------------------- */
  const tasteModal = document.getElementById('tasteModal');
  const tasteModalClose = document.getElementById('tasteModalClose');
  const tasteModalTitle = document.getElementById('tasteModalTitle');
  const tasteModalBody = document.getElementById('tasteModalBody');
  const tasteModalPrice = document.getElementById('tasteModalPrice');
  const tasteModalAddBtn = document.getElementById('tasteModalAddBtn');

  const dishDetailsMap = {
    'Boston Brick Smoked Brisket': {
      desc: 'Our pitmaster rubs beef brisket with crushed tellicherry peppercorns, sea salt, and brown sugar before smoke-roasting for 14 hours over white oak. Served sliced thick with black pepper bark and smoked barbecue glaze.',
      price: '₱1,280'
    },
    'Buttermilk Fried Chicken': {
      desc: 'Sourced fresh daily and soaked in a 24-hour sweet tea and buttermilk brine. Double hand-dredged in seasoned flour, cast-iron fried until golden, and drizzled with habanero-infused wildflower honey.',
      price: '₱890'
    },
    'South End Lobster Roll': {
      desc: 'Chunks of warm lobster tail and tiger prawns poached in clarify brown butter, seasoned with fresh chives, dill, and a touch of lemon zest inside a custom toasted brioche split-top roll.',
      price: '₱1,450'
    },
    'Cast-Iron Skillet Cornbread': {
      desc: 'Baked fresh in Lodge cast-iron skillets every 45 minutes. Crispy caramelized crust with a moist sweet yellow corn interior, crowned with a dollop of whipped honey-pecan butter.',
      price: '₱380'
    },
    'Smoked Pork Belly Mac': {
      desc: 'Cavatappi pasta coated in a velvety four-cheese blend of Vermont cheddar, gruyere, and smoked gouda. Baked under a blanket of panko breadcrumbs and thick lardons of hardwood smoked pork belly.',
      price: '₱620'
    },
    'Hot Clam Strip Basket': {
      desc: 'Fresh Atlantic razor clams flash fried in light cornmeal batter, tossed in cayenne pepper butter, and served alongside dill-capes tartar sauce and house sea salt fries.',
      price: '₱740'
    }
  };

  let currentInspectedDish = null;

  document.querySelectorAll('.btn-quick-taste').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dishKey = btn.dataset.dish;
      const details = dishDetailsMap[dishKey] || {
        desc: 'Handcrafted with signature Boston soul food ingredients, prepared fresh daily.',
        price: '₱950'
      };

      currentInspectedDish = dishKey;
      tasteModalTitle.textContent = dishKey;
      tasteModalBody.innerHTML = `<p>${details.desc}</p>`;
      tasteModalPrice.textContent = details.price;

      tasteModal.classList.add('active');
    });
  });

  if (tasteModalClose) {
    tasteModalClose.addEventListener('click', () => {
      tasteModal.classList.remove('active');
    });
  }

  if (tasteModalAddBtn) {
    tasteModalAddBtn.addEventListener('click', () => {
      if (currentInspectedDish) {
        const rawPrice = (dishDetailsMap[currentInspectedDish] ? dishDetailsMap[currentInspectedDish].price : '950').replace(/[^0-9]/g, '');
        toggleDishOrder(currentInspectedDish, rawPrice);
        tasteModal.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. THE BAR COCKTAIL INSPECTOR SWITCHER
     -------------------------------------------------------------------------- */
  const cocktailData = {
    'old-fashioned': {
      title: 'Boston Harbor Smoked Old Fashioned',
      desc: 'Smoked over hickory wood chips right at your table. Rich rye spice balanced with deep maple sweetness and seared citrus oils.',
      specs: 'Glass: Heavy Lowball • Ice: Hand-Carved Cube',
      img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80'
    },
    'sour': {
      title: 'Valero Street Citrus Sour',
      desc: 'Small-batch Kentucky bourbon shaken with fresh calamansi juice, roasted honey syrup, and velvet egg white foam with Angostura bitters.',
      specs: 'Glass: Coupe • Garnish: Dehydrated Calamansi Wheel',
      img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80'
    },
    'rye-smash': {
      title: 'Hickory Rye & Blackberry Smash',
      desc: 'Rittenhouse Rye 100 proof muddled with ripe wild blackberries, slapped fresh mint leaves, lemon juice, and topped with crisp ginger beer.',
      specs: 'Glass: Highball • Garnish: Mint Sprig & Berries',
      img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1000&q=80'
    },
    'fog-ipa': {
      title: 'Fenway Fog Hazy Draft IPA',
      desc: 'Freshly tapped hazy India Pale Ale brewed with Citra and Mosaic hops. Unfiltered, citrus-heavy, and velvety smooth.',
      specs: 'Serving: 16oz Draft Pint • 6.8% ABV',
      img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=1000&q=80'
    }
  };

  window.selectCocktailPreview = function(key) {
    const data = cocktailData[key];
    if (!data) return;

    const imgEl = document.getElementById('cocktailDisplayImg');
    const titleEl = document.getElementById('cocktailTitle');
    const descEl = document.getElementById('cocktailDesc');
    const specsEl = document.getElementById('cocktailSpecs');

    if (imgEl && titleEl && descEl && specsEl) {
      imgEl.style.opacity = '0.3';
      setTimeout(() => {
        imgEl.src = data.img;
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        specsEl.textContent = data.specs;
        imgEl.style.opacity = '1';
      }, 200);
    }
  };

  /* --------------------------------------------------------------------------
     8. CHEF'S TABLE EXPERIENCE SELECTOR TABS
     -------------------------------------------------------------------------- */
  const expTabs = document.querySelectorAll('.exp-tab');
  const expBadge = document.getElementById('expBadge');
  const expHeading = document.getElementById('expHeading');
  const expDesc = document.getElementById('expDesc');
  const courseList = document.getElementById('courseList');
  const expPhoto = document.getElementById('expPhoto');

  const expDataMap = {
    'journey': {
      badge: '5-COURSE TASTING MENU',
      heading: 'The Boston Soul Journey',
      desc: 'A celebratory voyage across Boston\'s classic soul food repertoire, reimagined with premium local and imported ingredients.',
      photo: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80',
      courses: [
        { num: 'COURSE I', name: 'Chilled Razor Clam Crudo', detail: 'Smoked tomato ponzu, celery leaf oil, crispy bacon crackling.' },
        { num: 'COURSE II', name: 'Sweet Tea Brined Quail', detail: 'Waffled sweet potato, charred habanero maple, whipped butter.' },
        { num: 'COURSE III', name: '14-Hour Smoked Wagyu Short Rib', detail: 'White oak smoke, braised collard greens, bone marrow gravy.' },
        { num: 'COURSE IV', name: 'Boston Clam & Truffle Chowder', detail: 'Smoked pancetta, potato foam, toasted brioche soldier.' },
        { num: 'COURSE V', name: 'Bourbon Pecan Skillet Pie', detail: 'Warm brown butter crust, smoked sea salt ice cream, rye reduction.' }
      ]
    },
    'bourbon': {
      badge: '4 COURSES + BOURBON PAIRINGS',
      heading: 'Smoke & Bourbon Flight Tasting',
      desc: 'Each course is paired with an exclusive 1.5oz pour of rare American small-batch whiskey or rye.',
      photo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80',
      courses: [
        { num: 'PAIRING I', name: 'Smoked Duck Breast Prosciutto', detail: 'Paired with WhistlePig 10 Year Small Batch Rye.' },
        { num: 'PAIRING II', name: 'Cast-Iron Seared Scallops', detail: 'Paired with Blanton\'s Single Barrel Bourbon.' },
        { num: 'PAIRING III', name: '14-Hr Smoked Prime Beef Rib', detail: 'Paired with Woodford Reserve Double Oaked.' },
        { num: 'PAIRING IV', name: 'Dark Chocolate Rye Tart', detail: 'Paired with Michter\'s US*1 Barrel Strength Rye.' }
      ]
    },
    'latenight': {
      badge: 'LATE NIGHT JAZZ SESSION',
      heading: 'Late Night Jazz & Supper',
      desc: 'Intimate late-night dining accompanied by live acoustic jazz quartet music and artisanal nightcaps.',
      photo: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=900&q=80',
      courses: [
        { num: 'BITES I', name: 'Nashville-Boston Hot Clam Basket', detail: 'Cayenne pepper butter, house tartar, bread & butter pickles.' },
        { num: 'BITES II', name: 'Mini Smoked Brisket Sliders', detail: 'Hickory glaze, sharp cheddar, brioche buns.' },
        { num: 'BITES III', name: 'Cast Iron Cornbread Bites', detail: 'Honey pecan butter, sea salt.' },
        { num: 'LIBATION', name: 'Choice of 2 Signature Cocktails', detail: 'Selection from our Midnight Reserve list.' }
      ]
    }
  };

  expTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      expTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const expKey = tab.dataset.exp;
      const data = expDataMap[expKey];

      if (data && expHeading && expDesc && courseList && expPhoto) {
        expBadge.textContent = data.badge;
        expHeading.textContent = data.heading;
        expDesc.textContent = data.desc;
        expPhoto.src = data.photo;

        courseList.innerHTML = data.courses.map(c => `
          <div class="course-row">
            <span class="course-num">${c.num}</span>
            <div class="course-text">
              <strong>${c.name}</strong>
              <p>${c.detail}</p>
            </div>
          </div>
        `).join('');
      }
    });
  });

  window.preselectChefTable = function() {
    const chefRadio = document.querySelector('input[name="seatingArea"][value="chefs"]');
    if (chefRadio) {
      chefRadio.checked = true;
    }
  };

  /* --------------------------------------------------------------------------
     9. ANIMATED STATS COUNTER ON SCROLL
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.dataset.target, 10);
          let count = 0;
          const step = Math.max(1, Math.floor(target / 30));
          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              stat.textContent = target;
              clearInterval(interval);
            } else {
              stat.textContent = count;
            }
          }, 40);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.getElementById('statsCounterStrip');
  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }

  /* --------------------------------------------------------------------------
     10. RESERVATION FORM HANDLING & TIME SLOT SELECTOR
     -------------------------------------------------------------------------- */
  const timeBtns = document.querySelectorAll('.time-btn');
  let selectedTimeSlot = '6:00 PM';

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimeSlot = btn.dataset.time;
    });
  });

  // Set default reservation date to today
  const resDateInput = document.getElementById('resDate');
  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.value = today;
    resDateInput.min = today;
  }

  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const bookingSuccessMsg = document.getElementById('bookingSuccessMsg');
  const bookingSuccessClose = document.getElementById('bookingSuccessClose');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('resName').value || 'Valued Guest';
      const guests = document.getElementById('resGuests').value;
      const date = document.getElementById('resDate').value;
      const seatingRadio = document.querySelector('input[name="seatingArea"]:checked');
      const seating = seatingRadio ? seatingRadio.parentElement.innerText.trim() : 'Main Dining';

      bookingSuccessMsg.innerHTML = `
        Dear <strong>${name}</strong>,<br/><br/>
        We have confirmed your table for <strong>${guests} Guest(s)</strong> on <strong>${date}</strong> at <strong>${selectedTimeSlot}</strong> (${seating}).<br/><br/>
        We look forward to serving you at <strong>GF Heart Tower, 108 Valero Street, Makati City</strong>.
      `;

      bookingSuccessModal.classList.add('active');
    });
  }

  if (bookingSuccessClose) {
    bookingSuccessClose.addEventListener('click', () => {
      bookingSuccessModal.classList.remove('active');
      bookingForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     11. DYNAMIC COPYRIGHT YEAR
     -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
