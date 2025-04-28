'use client';

import Image from "next/image";
import styles from "./page.module.css";
import "./fonts.scss";
import { useRef, useState, useEffect, StrictMode } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const [amount, setAmount] = useState(10);
  const [activeItem, setActiveItem] = useState(10);

  const fixedAmounts = [5, 10, 20, 50, 100];

  // Обновление ссылки PayPal на основе суммы
  const getPaypalUrl = (amount: number) => {
    return `https://www.paypal.com/donate/?business=BGRACRK3T5R5L&amount=${amount}&no_recurring=0&item_name=Your+support+helps+us+grow+Pixelmate%2C+making+tools+accessible+to+all.%0AThank+you+for+believing+in+us.¤cy_code=USD`;
  };

  // Обработчик изменения input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 1;
    if (value > 100000) value = 100000;

    setAmount(value);
    setActiveItem(value);

    if (fixedAmounts.includes(value)) {
      setActiveItem(value);
    } else {
      setActiveItem(-1);
    }
  };

  const handleFixedAmountClick = (value: number) => {
    setAmount(value);
    setActiveItem(value);
  };

  return (
    <div className={styles.page}>
      <div className={styles.globalWarning}>The website is still under construction. Sorry for the inconvenience</div>
      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <div className={styles.logo} onClick={() => window.location.reload()}>
              <Image
                src="/pictures/logo.svg"
                alt="Logo"
                width={30}
                height={30} />
              <span>pixelmate</span>
            </div>

            <div className={styles.buttons}>
              <div className={styles.signup} onClick={() => router.push('/sign-up')}><span>Sign Up</span></div>
              <div className={styles.getstarted} onClick={() => window.location.href = "/generation"}><span>Get Started</span></div>
              <div className={styles.signupMobile} onClick={() => router.push('/sign-up')}><span className="material-symbols-rounded">login</span></div>
            </div>
          </nav>

          <div className={styles.content}>
            <section className={styles.demo}>
              <div className={styles.text}>
                <h1>Your <span>pixel world</span> starts with just<br></br> one simple description</h1>
                <p>Create unique pixel sprites in seconds with our innovative AI tool. Whether you<br></br>are a game developer, an artist or just a pixel-style lover, our technology will<br></br>help you bring your ideas to life - quickly, easily and with incredible quality.</p>

                <div className={styles.buttons}>
                  <div className={styles.trynow} onClick={() => window.location.href = "/generation"}><span>Try Now</span></div>
                </div>
              </div>
              <Image
                src="/pictures/home/demo.png"
                alt="Demo"
                width={200}
                height={100}
                unoptimized />
            </section>

            <section className={styles.generation}>
              <div className={styles.left}>
                <div className={styles.text}>
                  <div className={styles.label}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c-35.3 0-64 28.7-64 64l-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0c0 35.3 28.7 64 64 64l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c35.3 0 64-28.7 64-64l40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0c0-35.3-28.7-64-64-64l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40zM160 128l192 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32l0-192c0-17.7 14.3-32 32-32zm192 32l-192 0 0 192 192 0 0-192z" /></svg>
                    <span>SPRITE FORMATION</span>
                  </div>
                  <h2>Generate and customize <br></br>sprites with perfect precision</h2>
                  <Image
                    className={styles.imageMobile}
                    src="/pictures/home/generation.svg"
                    alt="Demo"
                    width={403}
                    height={461}
                    unoptimized />
                  <p>Our advanced AI tool gives you full control, from basic design to fine-tuning details. Choose a style, adjust colors, add effects, and create pixel-perfect sprites for your games. Bring your vision to life with precision and explore customizable options.</p>

                  <div className={styles.items}>
                    <div className={styles.item}>
                      <div className={styles.icon}>
                        <span className="material-symbols-rounded">
                          accessibility
                        </span>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.title}>Humanoids</div>
                        <div className={styles.description}>Craft pixel-art humanoids with ease and precision, tailoring every detail from posture to expression.</div>
                      </div>
                    </div>

                    <div className={styles.item}>
                      <div className={styles.icon}>
                        <span className="material-symbols-rounded">
                          raven
                        </span>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.title}>Creatures</div>
                        <div className={styles.description}>Bring fantastical pixel creatures to life with flexible design options, perfect for immersive game worlds.</div>
                      </div>
                    </div>

                    <div className={styles.item}>
                      <div className={styles.icon}>
                        <span className="material-symbols-rounded">
                          park
                        </span>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.title}>Objects</div>
                        <div className={styles.description}>Design intricate pixel objects with limitless possibilities, ideal for enhancing your game environments.</div>
                      </div>
                    </div>

                    <div className={styles.item}>
                      <div className={styles.icon}>
                        <span className="material-symbols-rounded">
                          imagesmode
                        </span>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.title}>Icons</div>
                        <div className={styles.description}>Create stylish pixel icons with intuitive controls, adding a personal touch to your interfaces and menus.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.right}>
                <Image
                  src="/pictures/home/generation.svg"
                  alt="Demo"
                  width={403}
                  height={461}
                  unoptimized />
              </div>
            </section>

            <section className={styles.integration}>
              <div className={styles.left}>
                <div className={styles.text}>
                  <div className={styles.label}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" /></svg>
                    <span>GAME DEVELOPMENT</span>
                  </div>
                  <h2>Sprite integration into <br></br>newest game engines</h2>
                  <div className={styles.frameMobile}>
                    <Image
                      src="/pictures/home/sprite.png"
                      alt="Sprite"
                      width={100}
                      height={100}
                      unoptimized />
                  </div>
                  <p>Our AI-generated pixel sprites seamlessly integrate into Unity, Godot, Construct and Unreal Engine. Upload the files, set up animations, and you’re done! Save time and build unique games.</p>
                  <div className={styles.items}>
                    <div className={styles.item}>
                      <Image
                        src="/pictures/home/unity.svg"
                        alt="Unity"
                        width={34}
                        height={34}
                        unoptimized />
                    </div>

                    <div className={styles.item}>
                      <Image
                        src="/pictures/home/unrealengine.svg"
                        alt="Unity"
                        width={34}
                        height={34}
                        unoptimized />
                    </div>

                    <div className={styles.item}>
                      <Image
                        src="/pictures/home/godot.svg"
                        alt="Unity"
                        width={34}
                        height={34}
                        unoptimized />
                    </div>

                    <div className={styles.item}>
                      <Image
                        src="/pictures/home/construct.svg"
                        alt="Unity"
                        width={34}
                        height={34}
                        unoptimized />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.frame}>
                  <Image
                    src="/pictures/home/sprite.png"
                    alt="Sprite"
                    width={100}
                    height={100}
                    unoptimized />
                </div>
              </div>
            </section>

            <section className={styles.roadmap}>
              <div className={styles.label}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M256 32l-74.8 0c-27.1 0-51.3 17.1-60.3 42.6L3.1 407.2C1.1 413 0 419.2 0 425.4C0 455.5 24.5 480 54.6 480L256 480l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 64 201.4 0c30.2 0 54.6-24.5 54.6-54.6c0-6.2-1.1-12.4-3.1-18.2L455.1 74.6C446 49.1 421.9 32 394.8 32L320 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64zm64 192l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z" /></svg>
                <span>ROADMAP</span>
              </div>
              <h2>Our route:<br /> from idea to reality</h2>
              <p>Here you will see how we intend to innovate and move forward with a carefully crafted plan. We share the steps that will help us stay on the cutting edge of technology and ideas. Join us to see what discoveries await us!</p>
              <div className={styles.center}>
                <div className={styles.stages}>
                  <div className={styles.stage}>
                    <div className={styles.checkpointActive} style={{ top: '7.5px', left: '-10.5px' }}>
                      <span className="material-symbols-rounded">
                        check
                      </span>
                    </div>
                    <div className={styles.line} style={{ marginTop: '18px' }}></div>
                    <div className={styles.text} style={{ paddingTop: 0, paddingRight: '40px' }}>
                      <div className={styles.title}>Research and Planning</div>
                      <div className={styles.description}>
                        At this stage, we conduct a deep analysis of the game development market, study the needs of developers for tools to create pixel art sprites, and define the unique features of our AI solution. Our focus is on building a highly skilled team dedicated to driving innovation in AI-driven game development. We also develop concepts for the generation algorithms and models, ensuring they align with the vision and expertise of our team.
                      </div>
                    </div>
                    <Image
                      src="/pictures/home/roadmap.svg"
                      alt="Research"
                      width={100}
                      height={100}
                      style={{ top: '20px', left: '-150px' }}
                      unoptimized />
                  </div>

                  <div className={styles.topLine}></div>

                  <div className={styles.stage}>
                    <Image
                      src="/pictures/home/roadmap.svg"
                      alt="Research"
                      width={100}
                      height={100}
                      style={{ right: '-150px' }}
                      unoptimized />
                    <div className={styles.text} style={{ paddingLeft: '40px' }}>
                      <div className={styles.title}>Prototyping and Testing</div>
                      <div className={styles.description}>
                        We create the first working prototype of the AI pixel sprite generator, which is capable of generating basic images based on user requests. The prototype undergoes internal testing to evaluate the quality of generation, speed, and user interface convenience. Improvements are made based on feedback.
                      </div>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.checkpointActive} style={{ top: '47px', right: '-10.5px' }}>
                      <span className="material-symbols-rounded">
                        check
                      </span>
                    </div>
                  </div>

                  <div className={styles.bottomLine}></div>

                  <div className={styles.stage}>
                    <div className={styles.checkpointCurrent} style={{ top: '45px', left: '-13.5px' }}>
                      <span className="material-symbols-rounded">
                        star
                      </span>
                    </div>
                    <div className={styles.line} style={{ background: 'linear-gradient(to bottom, #3586FF 70px, #11244D 70px)' }}></div>
                    <div className={styles.text} style={{ paddingRight: '40px' }}>
                      <div className={styles.title}>Fundraising</div>
                      <div className={styles.description}>
                        At this stage, we prepare a presentation and business plan to attract investors. We hold meetings with venture capital funds, angel investors, and potential partners. Simultaneously, we organize the collection of regular donations through crowdfunding platforms and social media to attract additional funding from the game development community and enthusiasts. The goal is to secure resources for further development, marketing, and scaling of the project.
                      </div>
                    </div>
                    <Image
                      src="/pictures/home/roadmap.svg"
                      alt="Research"
                      width={100}
                      height={100}
                      style={{ left: '-150px' }}
                      unoptimized />
                  </div>

                  <div className={styles.topLine} style={{ backgroundColor: '#11244D' }}></div>

                  <div className={styles.stage}>
                    <Image
                      src="/pictures/home/roadmap.svg"
                      alt="Research"
                      width={100}
                      height={100}
                      style={{ right: '-150px' }}
                      unoptimized />
                    <div className={styles.text} style={{ paddingLeft: '40px' }}>
                      <div className={styles.title}>MVP Development and Pilot Launch</div>
                      <div className={styles.description}>
                        After securing investments, we complete the development of a Minimum Viable Product (MVP) with key features, including sprite generation, style customization, and export to popular formats for game development tools. We also develop complex models for animation generation and create high-quality datasets through manual and automated drawing.
                      </div>
                    </div>
                    <div className={styles.line} style={{ backgroundColor: '#11244D' }}></div>
                    <div className={styles.checkpoint} style={{ top: '48px', right: '-10.5px' }}></div>
                  </div>

                  <div className={styles.bottomLine} style={{ backgroundColor: '#11244D' }}></div>

                  <div className={styles.stage}>
                    <div className={styles.checkpoint} style={{ top: '47px', left: '-10.5px' }}></div>
                    <div className={styles.line} style={{ height: '55px', backgroundColor: '#11244D' }}></div>
                    <div className={styles.text} style={{ paddingRight: '40px' }}>
                      <div className={styles.title}>Scaling and Global Growth</div>
                      <div className={styles.description}>
                        In the final stage, we refine the product based on feedback, adding new features such as enhanced animation support and integration with game engines (Unity, Godot). We launch a large-scale marketing campaign, bring the product to the international market, and establish partnerships with major platforms and studios. We also introduce a subscription model or Freemium to ensure sustainable growth.
                      </div>
                    </div>
                    <Image
                      src="/pictures/home/roadmap.svg"
                      alt="Research"
                      width={100}
                      height={100}
                      style={{ left: '-150px' }}
                      unoptimized />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className={styles.about}>
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.label}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>
                <span>ABOUT US</span>
              </div>
              <Image
                src="/pictures/home/about.jpg"
                alt="About"
                width={100}
                height={100}
                unoptimized />
            </div>
            <div className={styles.text}>
              <h2>Millions of sprites<br></br><span>Millions of worlds</span></h2>
              <p>It all started with my love for the game Terraria, which captivated me with its charming pixel world, endless possibilities for exploration and construction. This game became a real inspiration for me - its bright colors, unique characters and dynamic worlds made me come back again and again. But over time, I noticed one thing: no matter how interesting Terraria is, it has its limits, and one day its possibilities run out.
                <br></br><br></br>
                This prompted me to think: what if we create a tool that will allow everyone to create their own endless worlds with unique sprites? This is how this project was born. I decided to combine my passion for pixel art and technology to develop an AI that will help not only me, but also other fans of games like Terraria to create new adventures without limits. Starting with a few lines of code and enthusiasm, I gradually turned the idea into reality, inspired by the classic style of 8-bit and 16-bit games.
                <br></br><br></br>
                My path was full of experiments and learning. I believe this service solves the problem of finite games like Terraria, Stardew Valley, Starbound and allowing everyone to build their own unique worlds and stories. My goal is to give you the opportunity to unleash your potential in gamedev and pave new paths in the world of pixel art. Join me, and let's create endless adventures together!</p>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <section className={styles.donate}>
              <div className={styles.left}>
                <div className={styles.text}>
                  <div className={styles.label}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                    <span>DONATION</span>
                  </div>
                  <h2>
                    Support the Spark
                    <span className="material-symbols-rounded">
                      stars_2
                    </span>
                  </h2>
                  <p>Your voluntary donations help fuel the creation of AI-generated pixel sprites that bring your creative ideas to life! Every contribution, no matter the size, supports us in enhancing and expanding this platform for creators like you. If you feel inspired, consider donating today—no pressure, just gratitude.</p>

                  <div className={styles.items}>
                    <div className={styles.custom}>
                      <div className={styles.icon}><span>$</span></div>
                      <input type="number" min="1" max="100000" value={amount} step="1" onChange={handleCustomAmountChange} />
                    </div>
                    {fixedAmounts.map((value) => (
                      <div
                        key={value}
                        className={`${styles.item} ${activeItem === value ? styles.active : ''}`}
                        onClick={() => handleFixedAmountClick(value)}>
                        ${value}
                      </div>
                    ))}
                    <div
                      key={200}
                      className={`${styles.item} ${styles.itemMobile} ${activeItem === 200 ? styles.active : ''}`}
                      onClick={() => handleFixedAmountClick(200)}>
                      ${200}
                    </div>
                  </div>
                  <div className={styles.message}>
                    <textarea placeholder="Leave your wish here (optional)"></textarea>
                  </div>
                  <div className={styles.buttons}>
                    <div className={styles.button} onClick={() => { window.location.href = getPaypalUrl(amount); }}>Donate
                      <span className="material-symbols-rounded">
                        volunteer_activism
                      </span>
                    </div>
                    <div className={styles.kickstarter}>Support us on
                      <Image
                        src="/pictures/home/kickstarter.svg"
                        alt="Kickstarter"
                        width={100}
                        height={20}
                        unoptimized />
                    </div>
                    <div className={styles.empty}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#2c2e4e" fillOpacity="1" d="M0,32L0,128L36.9,128L36.9,224L73.8,224L73.8,288L110.8,288L110.8,320L147.7,320L147.7,128L184.6,128L184.6,0L221.5,0L221.5,288L258.5,288L258.5,64L295.4,64L295.4,160L332.3,160L332.3,128L369.2,128L369.2,96L406.2,96L406.2,256L443.1,256L443.1,64L480,64L480,160L516.9,160L516.9,224L553.8,224L553.8,64L590.8,64L590.8,224L627.7,224L627.7,128L664.6,128L664.6,288L701.5,288L701.5,128L738.5,128L738.5,64L775.4,64L775.4,128L812.3,128L812.3,160L849.2,160L849.2,0L886.2,0L886.2,160L923.1,160L923.1,32L960,32L960,224L996.9,224L996.9,224L1033.8,224L1033.8,32L1070.8,32L1070.8,64L1107.7,64L1107.7,288L1144.6,288L1144.6,256L1181.5,256L1181.5,192L1218.5,192L1218.5,32L1255.4,32L1255.4,96L1292.3,96L1292.3,192L1329.2,192L1329.2,320L1366.2,320L1366.2,256L1403.1,256L1403.1,160L1440,160L1440,320L1403.1,320L1403.1,320L1366.2,320L1366.2,320L1329.2,320L1329.2,320L1292.3,320L1292.3,320L1255.4,320L1255.4,320L1218.5,320L1218.5,320L1181.5,320L1181.5,320L1144.6,320L1144.6,320L1107.7,320L1107.7,320L1070.8,320L1070.8,320L1033.8,320L1033.8,320L996.9,320L996.9,320L960,320L960,320L923.1,320L923.1,320L886.2,320L886.2,320L849.2,320L849.2,320L812.3,320L812.3,320L775.4,320L775.4,320L738.5,320L738.5,320L701.5,320L701.5,320L664.6,320L664.6,320L627.7,320L627.7,320L590.8,320L590.8,320L553.8,320L553.8,320L516.9,320L516.9,320L480,320L480,320L443.1,320L443.1,320L406.2,320L406.2,320L369.2,320L369.2,320L332.3,320L332.3,320L295.4,320L295.4,320L258.5,320L258.5,320L221.5,320L221.5,320L184.6,320L184.6,320L147.7,320L147.7,320L110.8,320L110.8,320L73.8,320L73.8,320L36.9,320L36.9,320L0,320L0,320Z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.right}>
                <Image
                  src="/pictures/home/donate.svg"
                  alt="Donation"
                  width={100}
                  height={100}
                  unoptimized />
              </div>
            </section>
          </div>
        </div>
      </main >
      <footer>
        <div className={styles.content}>
          <div className={styles.surface}>
            <div className={styles.logo}>
              <Image
                src="/pictures/logo.svg"
                alt="Logo"
                width={30}
                height={30} />
              <span>pixelmate</span>
            </div>
            <div className={styles.contact}>
              <div className={styles.label}>Email</div>
              <div className={styles.value} style={{ marginBottom: '8px' }}>pixelmateai@gmail.com</div>
              <div className={styles.label}>Phone (SMS only)</div>
              <div className={styles.value}>+1 (904) 671-6347</div>
            </div>
            <div className={styles.copyright}>© 2023 Pixelmate. All rights reserved.</div>
          </div>
          <div className={styles.links}>
            <div className={styles.column}>
              <p className={styles.title}>People</p>
              <p className={styles.link}><a>Acknowledgments</a></p>
              <p className={styles.link}><a href="https://discord.gg/pixelmate" target="_blank">Community</a></p>
              <p className={`${styles.link} ${styles.disabled}`}><a>Partners</a></p>
            </div>
            <div className={styles.column}>
              <p className={styles.title}>Project</p>
              <p className={styles.link}><a>Kickstarter</a></p>
              <p className={`${styles.link} ${styles.disabled}`}><a>Contact</a></p>
              <p className={`${styles.link} ${styles.disabled}`}><a>Pricing</a></p>
            </div>
            <div className={styles.column}>
              <p className={styles.title}>Information</p>
              <p className={`${styles.link} ${styles.disabled}`}><a>FAQ & Help</a></p>
              <p className={styles.link}><a>Privacy policy</a></p>
              <p className={styles.link}><a>Terms of use</a></p>
            </div>
          </div>
          <div className={styles.social}>
            <div className={styles.column}>
              <p className={styles.title}>Social Media</p>
              <div className={styles.buttons}>
                <div className={styles.linkedin} onClick={() => window.open('https://www.linkedin.com/company/pixelmateai', '_blank')}>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.5626 25.5624H21.1176V18.6C21.1176 16.94 21.0876 14.8025 18.8051 14.8025C16.4901 14.8025 16.1351 16.6125 16.1351 18.4775V25.5624H11.6901V11.245H15.9576V13.2025H16.0176C16.8876 11.7175 18.5076 10.8275 20.2276 10.89C24.7326 10.89 25.5651 13.8525 25.5651 17.71L25.5626 25.5599V25.5624ZM6.67506 9.2875C5.99225 9.28422 5.3383 9.01169 4.85523 8.5291C4.37217 8.0465 4.099 7.39282 4.09506 6.71001C4.09506 5.29502 5.26006 4.13002 6.67506 4.13002C8.09006 4.13002 9.25256 5.29502 9.25506 6.71001C9.25506 8.12501 8.09006 9.2875 6.67506 9.2875ZM8.89756 25.5624H4.44756V11.245H8.89756V25.5624ZM27.7751 3.71579e-05H2.21256C1.63294 -0.0033294 1.0754 0.222185 0.661119 0.627575C0.246833 1.03297 0.0092727 1.58547 6.10352e-05 2.16503V27.8349C0.0092727 28.4145 0.246833 28.967 0.661119 29.3724C1.0754 29.7778 1.63294 30.0033 2.21256 29.9999H27.7776C28.3585 30.0046 28.9179 29.7799 29.334 29.3745C29.7502 28.9691 29.9895 28.4158 30.0001 27.8349V2.16253C29.9895 1.5821 29.75 1.02935 29.3337 0.624757C28.9174 0.220158 28.3581 -0.00349562 27.7776 0.00253697L27.7751 3.71579e-05Z" fill="#3586FF" />
                  </svg>
                </div>
                <div className={styles.kickstarter}>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.00006 0C2.23864 0 6.10352e-05 2.23858 6.10352e-05 5V25C6.10352e-05 27.7614 2.23864 30 5.00006 30H25.0001C27.7615 30 30.0001 27.7614 30.0001 25V5C30.0001 2.23858 27.7615 0 25.0001 0H5.00006ZM22.5421 24.6562C21.0438 25.8251 18.8819 25.5583 17.7129 24.06L15.4167 21.1169C14.6306 20.1094 13.0145 20.6652 13.0145 21.9431C13.0145 23.8441 11.4741 25.3847 9.57382 25.3847C7.67353 25.3847 6.13318 23.8441 6.13318 21.9431V8.05675C6.13318 6.15574 7.67353 4.61539 9.57382 4.61539C11.4741 4.61539 13.0145 6.15574 13.0145 8.05675C13.0145 9.03883 14.2662 9.45354 14.8526 8.66572L16.7104 6.16965C17.8451 4.64512 20.0006 4.3289 21.525 5.46303C23.0494 6.59769 23.3658 8.75308 22.2316 10.2784L21.3127 11.5129C19.9687 13.3184 19.9968 15.7993 21.3813 17.5739L23.1389 19.8269C24.3078 21.3252 24.0409 23.4871 22.5421 24.6562Z" fill="#3586FF" />
                  </svg>
                </div>
                <div className={styles.discord} onClick={() => window.open('https://discord.gg/pixelmate', '_blank')}>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.50006 0H25.5001C27.9853 0 30.0001 2.01472 30.0001 4.5V25.5C30.0001 27.9853 27.9853 30 25.5001 30H4.50006C2.01478 30 6.10352e-05 27.9853 6.10352e-05 25.5V4.5C6.10352e-05 2.01472 2.01478 0 4.50006 0ZM20.2735 22.9688L19.043 21.5039C21.4454 20.8594 22.3829 19.2188 22.3829 19.2188C19.336 22.0898 11.0157 22.207 7.79303 19.2188C7.79303 19.2188 8.61334 20.7422 11.0743 21.5039L9.72662 22.9688C5.62506 22.9102 4.04303 20.1562 4.04303 20.1562C4.04303 14.0625 6.73834 9.19922 6.73834 9.19922C9.49225 7.26562 12.0118 7.26562 12.0118 7.26562L12.1876 7.5C8.78912 8.4375 7.32428 9.96094 7.32428 9.96094C11.3087 7.26562 19.5118 7.5 22.7344 9.96094C22.793 9.90234 20.8008 8.32031 17.6954 7.5L17.9883 7.26562C17.9883 7.26562 20.5079 7.26562 23.2618 9.19922C23.2618 9.19922 25.9571 14.0625 25.9571 20.1562C25.9571 20.1562 24.3751 22.9102 20.2735 22.9688ZM13.418 16.3477C13.418 17.4803 12.5523 18.3984 11.4844 18.3984C10.4165 18.3984 9.55084 17.4803 9.55084 16.3477C9.55084 15.215 10.4165 14.2969 11.4844 14.2969C12.5523 14.2969 13.418 15.215 13.418 16.3477ZM20.2149 16.3477C20.2149 17.4803 19.3492 18.3984 18.2813 18.3984C17.2134 18.3984 16.3477 17.4803 16.3477 16.3477C16.3477 15.215 17.2134 14.2969 18.2813 14.2969C19.3492 14.2969 20.2149 15.215 20.2149 16.3477Z" fill="#3586FF" />
                  </svg>

                </div>
                <div className={styles.x}>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.00006 0C2.23863 0 6.10352e-05 2.23857 6.10352e-05 5V25C6.10352e-05 27.7614 2.23863 30 5.00006 30H25.0001C27.7615 30 30.0001 27.7614 30.0001 25V5C30.0001 2.23857 27.7615 0 25.0001 0H5.00006ZM6.49002 6.42857H12.1597L16.1859 12.1498L21.0715 6.42857H22.8572L16.9922 13.2952L24.2244 23.5714H18.5561L13.884 16.9336L8.21435 23.5714H6.42863L13.0776 15.7882L6.49002 6.42857ZM9.22439 7.85714L19.3011 22.1429H21.49L11.4133 7.85714H9.22439Z" fill="#3586FF" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.copyrightMobile}>© 2023 Pixelmate. All rights reserved.</div>
        </div>
      </footer>
    </div >
  );
}