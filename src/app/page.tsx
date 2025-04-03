'use client';

import Image from "next/image";
import styles from "./page.module.css";
import "./fonts.scss";
import { useRef, useState, useEffect, StrictMode } from 'react';

export default function Generation() {

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <div className={styles.logo}>
              <Image
                src="/pictures/logo.svg"
                alt="Logo"
                width={30}
                height={30}
                onClick={() => window.location.reload()} />
              <span>pixelmate</span>
            </div>

            <div className={styles.buttons}>
              <div className={styles.signup}><span>Sign Up</span></div>
              <div className={styles.getstarted} onClick={() => window.location.href = "/generation"}><span>Get Started</span></div>
            </div>
          </nav>

          <div className={styles.content}>
            <section className={styles.demo}>
              <div className={styles.left}>
                <div className={styles.text}>
                  <h1>Your pixel world starts with<br></br>just one simple description</h1>
                  <p>Create unique pixel sprites in seconds with our innovative AI tool. Whether you<br></br>are a game developer, an artist or just a pixel-style lover, our technology will<br></br>help you bring your ideas to life - quickly, easily and with incredible quality.</p>

                  <div className={styles.buttons}>
                    <div className={styles.trynow} onClick={() => window.location.href = "/generation"}><span>Try Now</span></div>
                    <div className={styles.jointeam}><span>Join Team</span></div>
                  </div>
                </div>
              </div>

              <div className={styles.right}>
                <Image
                  src="/pictures/home/demo.png"
                  alt="Demo"
                  width={403}
                  height={461}
                  unoptimized />
              </div>
            </section>

            <section className={styles.generation}>
              <div className={styles.left}>
                <div className={styles.text}>
                  <div className={styles.label}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c-35.3 0-64 28.7-64 64l-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0c0 35.3 28.7 64 64 64l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c35.3 0 64-28.7 64-64l40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0c0-35.3-28.7-64-64-64l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40zM160 128l192 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32l0-192c0-17.7 14.3-32 32-32zm192 32l-192 0 0 192 192 0 0-192z" /></svg>
                    <span>SPRITE FORMATION</span>
                  </div>
                  <h2>Generate and customize<br></br>sprites with perfect precision</h2>
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
                  <h2>Sprite integration into<br></br>newest game engines</h2>
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
            </section>
          </div>
        </div>

        <div className={styles.about}>
          <div className={styles.content}>
            <Image
              src="/pictures/home/about.jpg"
              alt="About"
              width={100}
              height={100}
              unoptimized />
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
      </main>
    </div>
  );
}