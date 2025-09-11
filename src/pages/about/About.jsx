function About() {

    // const data = [
    //     {
    //         name: "Fruit",
    //         fruits: ["apple", "banana", "orange", "kiwi"]
    //     },
    //     {
    //         name: "Cars",
    //         cars: ["bmw", "audi", "mercedes"]
    //     }
    // ]

    const data = [
        {name: "A", value: 1},
        {name: "B", value: 2, isSelected: true},
        {name: "C", value: 3}
    ]

    return (
        <>
            <div className="container">
                <div className="about-content">

                    <ul>
                        {
                            // data.d2.map((item) => {
                            //     return item.map((i) => {
                            //         console.log(i);
                            //         return <li>{i}</li>

                            //     })
                            // })

                        }
                    </ul>
                    <div className="list">
                        <select>
                            {
                                data.map((item) => {
                                    if(item.isSelected === true){
                                        return <option selected>{item.name}</option>
                                    }                                    
                                    return <option>{item.name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About


