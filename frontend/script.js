const API_URL = "http://localhost:5000/api";
/* ============================================================
   JAVASCRIPT — HESTIIA RESTAURANT
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // ─── RAZORPAY CONFIG ──────────────────────────────────────
  // Replace with your actual Razorpay key ID from dashboard
  const RAZORPAY_KEY = "rzp_test_YourKeyHere";

  // ─── PRELOADER ──────────────────────────────────────────
  let prog = 0;
  const preloader = document.getElementById("preloader");
  const bar = document.getElementById("preloaderBar");

  function loadSim() {
    const interval = setInterval(() => {
      prog += Math.random() * 7 + 2;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add("hidden");
          document.body.style.overflow = "auto";
        }, 500);
      }
      bar.style.width = prog + "%";
    }, 120);
  }
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (!preloader.classList.contains("hidden")) {
        prog = 100;
        bar.style.width = "100%";
        setTimeout(() => {
          preloader.classList.add("hidden");
          document.body.style.overflow = "auto";
        }, 500);
      }
    }, 800);
  });
  loadSim();

  // ─── POPUP BOOKING ──────────────────────────────────────
  const popup = document.getElementById("popupBooking");
  const closePopup = document.getElementById("closePopup");

  setTimeout(() => {
    popup.classList.add("open");
  }, 1500);

  closePopup.addEventListener("click", () => popup.classList.remove("open"));
  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.classList.remove("open");
  });

  // ─── NAVIGATION SYSTEM ──────────────────────────────────
  function navigateTo(page) {
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.remove("active"));

    const target = document.getElementById("page-" + page);
    if (target) {
      target.classList.add("active");
      void target.offsetWidth;
      target.style.opacity = "0";
      target.style.transform = "translateY(30px)";
      requestAnimationFrame(() => {
        target.style.opacity = "1";
        target.style.transform = "translateY(0)";
      });
    }

    document.querySelectorAll(".nav-links > li > a").forEach((a) => {
      a.classList.remove("active");
      if (a.dataset.page === page) {
        a.classList.add("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    if (menuOpen) hamburger.click();
    // Close cart when navigating
    document.getElementById("cartPanel").classList.remove("open");
  }

  window.navigateTo = navigateTo;

  // ─── NAVBAR SCROLL ──────────────────────────────────────
  const navbar = document.getElementById("navbar");
  const scrollProgress = document.getElementById("scrollProgress");
  const backTop = document.getElementById("backTop");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

    if (y > 500) backTop.classList.add("show");
    else backTop.classList.remove("show");
  });

  backTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  // ─── HAMBURGER ───────────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  let menuOpen = false;

  hamburger.addEventListener("click", function () {
    menuOpen = !menuOpen;
    const spans = this.querySelectorAll("span");
    if (menuOpen) {
      navLinks.style.display = "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "60px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "rgba(10,10,10,0.96)";
      navLinks.style.backdropFilter = "blur(24px)";
      navLinks.style.padding = "24px 24px 30px";
      navLinks.style.gap = "14px";
      navLinks.style.borderBottom = "1px solid rgba(255,255,255,0.04)";
      navLinks.style.zIndex = "999";
      navLinks.querySelectorAll(".dropdown").forEach((d) => {
        d.style.position = "relative";
        d.style.top = "0";
        d.style.left = "0";
        d.style.transform = "none";
        d.style.opacity = "1";
        d.style.visibility = "visible";
        d.style.boxShadow = "none";
        d.style.background = "transparent";
        d.style.padding = "6px 0 6px 20px";
        d.style.border = "none";
      });
      spans[0].style.transform = "rotate(45deg) translate(4px,4px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(4px,-4px)";
    } else {
      navLinks.style.display = "";
      navLinks.style.flexDirection = "";
      navLinks.style.position = "";
      navLinks.style.top = "";
      navLinks.style.left = "";
      navLinks.style.right = "";
      navLinks.style.background = "";
      navLinks.style.backdropFilter = "";
      navLinks.style.padding = "";
      navLinks.style.gap = "";
      navLinks.style.borderBottom = "";
      navLinks.style.zIndex = "";
      navLinks.querySelectorAll(".dropdown").forEach((d) => {
        d.style.position = "";
        d.style.top = "";
        d.style.left = "";
        d.style.transform = "";
        d.style.opacity = "";
        d.style.visibility = "";
        d.style.boxShadow = "";
        d.style.background = "";
        d.style.padding = "";
        d.style.border = "";
      });
      spans.forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
      });
    }
  });

  // ─── CART SYSTEM ──────────────────────────────────────────
  let cart = JSON.parse(localStorage.getItem("hestiia_cart")) || [];

  function saveCart() {
    localStorage.setItem("hestiia_cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    const itemsContainer = document.getElementById("cartItems");
    const footer = document.getElementById("cartFooter");
    const totalEl = document.getElementById("cartTotal");
    const badge = document.getElementById("cartBadge");

    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Update badge
    if (badge) {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove("empty");
      } else {
        badge.classList.add("empty");
      }
    }

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
                  <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    Your cart is empty.<br />
                    <span style="font-size: 0.8rem; opacity: 0.6">Add items from our menu</span>
                  </div>
                `;
      footer.style.display = "none";
      return;
    }

    footer.style.display = "block";
    totalEl.textContent = "₹" + total;

    let html = "";
    cart.forEach((item, idx) => {
      html += `
                    <div class="cart-item">
                      <div class="info">
                        <h5>${item.name}</h5>
                        <div class="price">₹${item.price} × ${item.qty}</div>
                      </div>
                      <div class="qty">
                        <button onclick="changeQty(${idx}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${idx}, 1)">+</button>
                        <button class="remove-item" onclick="removeItem(${idx})"><i class="fas fa-trash"></i></button>
                      </div>
                    </div>
                  `;
    });
    itemsContainer.innerHTML = html;
  }

  window.changeQty = function (idx, delta) {
    if (cart[idx]) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
      saveCart();
      updateCartUI();
    }
  };

  window.removeItem = function (idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartUI();
  };

  // ─── ADD TO CART FROM MENU ──────────────────────────────
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-cart-btn");
    if (btn) {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      saveCart();
      updateCartUI();

      // Show toast notification
      showToast(`✓ ${name} added to cart!`);
    }
  });

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }

  // ─── CART PANEL TOGGLE ──────────────────────────────────
  const navCartBtn = document.getElementById("navCartBtn");
  const cartPanel = document.getElementById("cartPanel");
  const closeCart = document.getElementById("closeCart");

  navCartBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
  });

  closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("open");
  });

  // Close cart on outside click
  document.addEventListener("click", (e) => {
    if (
      cartPanel.classList.contains("open") &&
      !cartPanel.contains(e.target) &&
      e.target !== navCartBtn &&
      !navCartBtn.contains(e.target)
    ) {
      cartPanel.classList.remove("open");
    }
  });

  // ─── RAZORPAY CHECKOUT ──────────────────────────────────
  document.getElementById("checkoutBtn").addEventListener("click", function () {
    if (cart.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Create order options
    const options = {
      key: RAZORPAY_KEY,
      amount: total * 100, // Amount in paise
      currency: "INR",
      name: "HESTIIA Restaurant",
      description: "Food Order Payment",
      image: "https://via.placeholder.com/100x100?text=HESTIIA",
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        address: "HESTIIA Restaurant, Kanpur",
        order_items: cart
          .map((item) => `${item.name} × ${item.qty}`)
          .join(", "),
      },
      theme: {
        color: "#C9A84C",
      },
      handler: async function (response) {
        // Payment success
        const orderId = "ORD-" + Date.now();
        const orderData = {
          customer_name:
            document.getElementById("customerName")?.value || "Guest User",
          email: document.getElementById("customerEmail")?.value || "",
          phone: document.getElementById("customerPhone")?.value || "",
          address: document.getElementById("customerAddress")?.value || "",
          city: document.getElementById("customerCity")?.value || "",
          state: document.getElementById("customerState")?.value || "",
          pincode: document.getElementById("customerPincode")?.value || "",

          items: cart,

          subtotal: total,
          gst: 0,
          delivery_charge: 0,
          total: total,

          payment_method: "Razorpay",
        };
        try {
          const response = await fetch(`${API_URL}/orders`, {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(orderData),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message);
          }

          console.log(result);
        } catch (error) {
          console.log(error);
        }

        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        cartPanel.classList.remove("open");

        // Send WhatsApp notification
        const waMsg =
          `🆕 *New Order Placed!*\n\n` +
          `🆔 Order ID: ${orderId}\n` +
          `📦 Items:\n${orderData.items.map((i) => `  • ${i.name} × ${i.qty} = ₹${i.price * i.qty}`).join("\n")}\n` +
          `💰 Total: ₹${total}\n` +
          `💳 Payment ID: ${response.razorpay_payment_id}\n` +
          `📅 Date: ${new Date().toLocaleString()}`;

        const waUrl = `https://wa.me/916392693457?text=${encodeURIComponent(waMsg)}`;
        window.open(waUrl, "_blank");

        showToast(`✅ Order placed successfully! Order ID: ${orderId}`);
      },
      modal: {
        ondismiss: function () {
          showToast("Payment cancelled.", "error");
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });

  // ─── MENU DATA & RENDER ─────────────────────────────────
  const menuData = [
    {
      name: "Veg Sandwich",
      category: "sandwich",
      price: 119,
      desc: "Fresh veggies with cheese",
    },
    {
      name: "Cheese Sandwich",
      category: "sandwich",
      price: 139,
      desc: "Grilled cheese delight",
    },
    {
      name: "Paneer Tikka Sandwich",
      category: "sandwich",
      price: 169,
      desc: "Tandoori paneer",
    },
    {
      name: "Veg Burger",
      category: "burger",
      price: 89,
      desc: "Classic veg patty",
    },
    {
      name: "Cheese Burger",
      category: "burger",
      price: 109,
      desc: "Loaded with cheese",
    },
    {
      name: "Margherita",
      category: "pizza",
      price: 189,
      desc: "Only cheese topping",
    },
    {
      name: "Fresh Veggies",
      category: "pizza",
      price: 219,
      desc: "Onion, Tomato, Capsicum",
    },
    {
      name: "Paneer Tikka Pizza",
      category: "pizza",
      price: 279,
      desc: "Roasted paneer",
    },
    {
      name: "Hestiia Special",
      category: "pizza",
      price: 339,
      desc: "Loaded with everything",
    },
    {
      name: "White Sauce Pasta",
      category: "pasta",
      price: 249,
      desc: "Creamy white sauce",
    },
    {
      name: "Red Sauce Pasta",
      category: "pasta",
      price: 219,
      desc: "Tangy red sauce",
    },
    {
      name: "Paneer Butter Masala",
      category: "indian",
      price: 285,
      desc: "Rich tomato gravy",
    },
    {
      name: "Kadhai Paneer",
      category: "indian",
      price: 275,
      desc: "Spicy kadhai",
    },
    {
      name: "Dal Makhani",
      category: "indian",
      price: 229,
      desc: "Creamy black dal",
    },
    {
      name: "Veg Biryani",
      category: "indian",
      price: 189,
      desc: "Fragrant rice",
    },
    {
      name: "Hyderabadi Biryani",
      category: "indian",
      price: 209,
      desc: "Rich & spicy",
    },
    {
      name: "Honey Chilli Potato",
      category: "chinese",
      price: 165,
      desc: "Sweet & spicy",
    },
    {
      name: "Veg Manchurian",
      category: "chinese",
      price: 219,
      desc: "Dry or gravy",
    },
    {
      name: "Veg Fried Rice",
      category: "chinese",
      price: 165,
      desc: "Classic fried rice",
    },
    {
      name: "Hakka Noodles",
      category: "chinese",
      price: 165,
      desc: "Stir-fried noodles",
    },
    {
      name: "Mojito",
      category: "beverages",
      price: 149,
      desc: "Classic mojito",
    },
    {
      name: "Blue Lagoon",
      category: "beverages",
      price: 149,
      desc: "Blue curaçao",
    },
    {
      name: "Fresh Lime Soda",
      category: "beverages",
      price: 85,
      desc: "Lime & soda",
    },
    { name: "Gulab Jamun", category: "desserts", price: 49, desc: "2 pieces" },
    {
      name: "Hot Chocolate Brownie",
      category: "desserts",
      price: 149,
      desc: "With ice cream",
    },
    {
      name: "Chocolate Shake",
      category: "shakes",
      price: 149,
      desc: "Thick chocolate",
    },
    { name: "Oreo Shake", category: "shakes", price: 159, desc: "Oreo cookie" },
    {
      name: "Kit-Kat Shake",
      category: "shakes",
      price: 159,
      desc: "Kit-Kat chunks",
    },
    {
      name: "Cold Coffee",
      category: "shakes",
      price: 149,
      desc: "Iced coffee",
    },
    {
      name: "Hestiia Special Shake",
      category: "shakes",
      price: 199,
      desc: "Signature shake",
    },
  ];

  function renderMenu(category) {
    const filtered =
      category === "all"
        ? menuData
        : menuData.filter((item) => item.category === category);
    const limited = filtered.slice(0, 8);
    const grid = document.getElementById("menuGrid");
    grid.innerHTML = limited
      .map(
        (item) => `
                        <div class="menu-item">
                            <div class="thumb">
                                <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=100&q=80" alt="${item.name}" loading="lazy" />
                            </div>
                            <div class="info">
                                <h5>${item.name}</h5>
                                <div class="meta">${item.desc} <span>•</span> ${item.category}</div>
                            </div>
                            <div class="price-tag">₹${item.price}</div>
                            <button class="add-cart-btn" data-name="${item.name}" data-price="${item.price}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    `,
      )
      .join("");
  }
  renderMenu("all");

  document.querySelectorAll(".menu-filter").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".menu-filter")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      renderMenu(this.dataset.category);
    });
  });

  // ─── NEWSLETTER ──────────────────────────────────────────
  document
    .getElementById("footerNewsletterBtn")
    .addEventListener("click", function () {
      const input = document.getElementById("footerNewsletter");
      if (input.value.trim() && input.value.includes("@")) {
        alert(
          "✓ Thank you for subscribing! Get 25% off on your first order. (T&C apply)",
        );
        input.value = "";
      } else {
        alert("Please enter a valid email address.");
      }
    });

  // ─── INQUIRY FORM ──────────────────────────────────────
  document
    .getElementById("inquiryForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        name: document.getElementById("inqName").value.trim(),
        email: document.getElementById("inqEmail").value.trim(),
        phone: document.getElementById("inqPhone").value.trim(),
        subject: document.getElementById("inqSubject").value.trim(),
        message: document.getElementById("resRequests").value,
      };

      if (!data.name || !data.email || !data.message) {
        alert("Please fill all required fields.");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.success) {
          document.getElementById("inqSuccess").classList.add("show");
          this.querySelector(".btn-submit").textContent = "✓ Sent!";
          this.reset();

          setTimeout(() => {
            document.getElementById("inqSuccess").classList.remove("show");
            this.querySelector(".btn-submit").textContent = "Send Your Message";
          }, 3000);
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error(err);
        alert("Server Error");
      }
    });
  // ─── RESERVATION FORM ──────────────────────────────────
  document
    .getElementById("reservationForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        name: document.getElementById("resName").value,
        email: document.getElementById("resEmail").value,
        phone: document.getElementById("resPhone").value,
        guests: parseInt(document.getElementById("resGuests").value),
        booking_date: document.getElementById("resDate").value,
        booking_time: document.getElementById("resTime").value,
        message: document.getElementById("resMessage").value,
      };

      try {
        const res = await fetch(`${API_URL}/reservations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.success) {
          document.getElementById("resSuccess").classList.add("show");

          this.querySelector(".btn-reserve").textContent = "✓ Reserved!";
          this.querySelector(".btn-reserve").style.background = "#0F8B6D";

          this.reset();

          setTimeout(() => {
            document.getElementById("resSuccess").classList.remove("show");
            this.querySelector(".btn-reserve").textContent = "Reserve Table";
            this.querySelector(".btn-reserve").style.background = "";
          }, 3000);
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.log(err);
        alert("Server Error");
      }
    });

  // ─── AI CHATBOT ──────────────────────────────────────────
  const chatToggle = document.getElementById("chatToggle");
  const chatWidget = document.getElementById("chatWidget");
  const closeChat = document.getElementById("closeChat");
  const chatMessages = document.getElementById("chatMessages");

  chatToggle.addEventListener("click", () => {
    chatWidget.classList.toggle("open");
  });

  closeChat.addEventListener("click", () => {
    chatWidget.classList.remove("open");
  });

  const whatsappNumber = "916392693457";

  document.querySelectorAll(".chat-options .opt-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.dataset.action;

      const userMsg = document.createElement("div");
      userMsg.className = "msg user";
      userMsg.textContent = this.textContent.trim();
      chatMessages.appendChild(userMsg);

      let response = "";
      let waMsg = "";

      switch (action) {
        case "book":
          response =
            "📍 You can book a table by calling us at <strong>6392693457</strong> or use our <strong>Book Table</strong> button.";
          waMsg = "Hello HESTIIA, I would like to book a table.";
          break;
        case "menu":
          response =
            '🍽️ Explore our delicious menu <a href="#" onclick="navigateTo(\'menu\'); chatWidget.classList.remove(\'open\');" style="color:var(--gold);">here</a> or visit our Zomato/Swiggy pages.';
          waMsg = "Hello HESTIIA, I would like to see your menu.";
          break;
        case "contact":
          response =
            "📧 You can reach us at <strong>info@hestiia.com</strong> or call <strong>6392693457</strong>. We're here to help!";
          waMsg = "Hello HESTIIA, I have a question.";
          break;
        case "membership":
          response =
            '👑 For membership inquiries, please visit our <a href="#" onclick="navigateTo(\'inquiry\'); chatWidget.classList.remove(\'open\');" style="color:var(--gold);">Inquiry page</a> or contact +91 9999980721.';
          waMsg = "Hello HESTIIA, I am interested in your membership program.";
          break;
        default:
          response =
            "Thank you for reaching out! How can I assist you further?";
          waMsg = "Hello HESTIIA, I have a question.";
      }

      setTimeout(() => {
        const botMsg = document.createElement("div");
        botMsg.className = "msg bot";
        botMsg.innerHTML = response;
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
        window.open(waUrl, "_blank");
      }, 600);

      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  });

  // ─── THREE.JS PARTICLES ──────────────────────────────────
  (function initParticles() {
    const container = document.getElementById("hero-particles");
    if (!container || typeof THREE === "undefined") return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    const count = 160;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const c = 0.5 + Math.random() * 0.5;
      colors[i * 3] = c * 0.95;
      colors[i * 3 + 1] = c * 0.7;
      colors[i * 3 + 2] = c * 0.35;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.045,
      transparent: true,
      opacity: 0.4,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);
    camera.position.z = 6;
    let t = 0;

    function animParticles() {
      requestAnimationFrame(animParticles);
      t += 0.001;
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3 + 1] += Math.sin(t + i * 0.5) * 0.0006;
        pos[i3] += Math.cos(t * 0.6 + i * 0.3) * 0.0005;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0002;
      renderer.render(scene, camera);
    }
    animParticles();
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();

  // ─── INTERSECTION OBSERVER ─────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
    .forEach((el) => {
      observer.observe(el);
    });

  // ─── KEYBOARD ACCESSIBILITY ────────────────────────────
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (menuOpen) hamburger.click();
      popup.classList.remove("open");
      chatWidget.classList.remove("open");
      cartPanel.classList.remove("open");
    }
  });

  // ─── INIT CART UI ──────────────────────────────────────
  updateCartUI();

  console.log("✦ HESTIIA — Premium Luxury Restaurant Website ✦");
  console.log(
    "📍 Map Location: 1-b, Ram Puram, Shyam Nagar, Kanpur, UP 208013",
  );
  console.log("🛒 Cart System with Razorpay Payment Integration");
  console.log("🔑 Razorpay Key: " + RAZORPAY_KEY);
});

// ===============================
// Reservation Form Backend Connect
// ===============================
const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
  reservationForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById("resName").value.trim(),
      email: document.getElementById("resEmail").value.trim(),
      phone: document.getElementById("resPhone").value.trim(),
      guests: parseInt(document.getElementById("resGuests").value),
      booking_date: document.getElementById("resDate").value,
      booking_time: document.getElementById("resTime").value,
      message: document.getElementById("resRequests").value,
    };

    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        document.getElementById("resSuccess").classList.add("show");
        reservationForm.reset();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  });
}
