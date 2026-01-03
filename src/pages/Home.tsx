import lpImg from '../../public/images/lp.png';

function Home (){
    return(
        <>
            <div id="main">
                <section className="left">
                    <h2>my playlist</h2>
                    <div className="total_info">
                        <span>now</span><p>0</p>
                    </div>
                    <div className="list_wrap">
                        <ul>
                            <li className="list_box">
                                <div className="album_img"></div>
                                <div className="album_info">
                                    <h3>노래제목</h3>
                                    <p>가수</p>
                                </div>
                            </li>
                            <li className="list_box">
                                <div className="album_img"></div>
                                <div className="album_info">
                                    <h3>노래제목</h3>
                                    <p>가수</p>
                                </div>
                            </li>
                            <li className="list_box">
                                <div className="album_img"></div>
                                <div className="album_info">
                                    <h3>노래제목</h3>
                                    <p>가수</p>
                                </div>
                            </li>
                            <li className="list_box">
                                <div className="album_img"></div>
                                <div className="album_info">
                                    <h3>노래제목</h3>
                                    <p>가수</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bottom_btn">
                        <button type="button">add music</button>
                        <button type="button">save list</button>
                    </div>
                </section>
                <section className="right">
                    <div className="lp_wrap">
                        <div className="vinyl"><img src={lpImg} alt="lp" /></div>
                        <div className="cover_img"></div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Home;