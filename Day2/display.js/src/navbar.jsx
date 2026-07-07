import "./App.css";
function Navbar(){
    return<>
   
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>structure</title>
    </head>
    <body class="bg-red-500">
         <div class="navbar">
            <div>
            <img src="../../HTML/Assets/i.jpg" alt="img" />
            </div>
            <div class="parent">
                <div>
                    <input type="text" placeholder="Search" />
                </div>
            <div>
                <p>Home</p>
                </div>
                <div>
                <p>Login</p>
            </div>
            </div>
         </div>
     <div>
        <form >
            <h1>Form</h1>
            <label >Enter a Name:</label>
            <input type="text" />
            <br/>
            <br/>
            <label >Enter a Email:</label>
            <input type="text" />
            <br/>
            <br/>
            <label >Enter a Phone No:</label>
            <input type="number" />
            <br/>
            <br/>
            <label >Enter a Adress:</label>
            <input type="text" />
            <button>Summit</button>
        </form>
     </div>
     <div>
        <h2>Table</h2>
        <table>
            <th>NO</th>
            <th>Name</th>
            <th>Age</th>
            <th>Salary</th>
            <th>Email</th>
            <tr>
                <td>1</td>
                <td>Lokesh</td>
                <td>21</td>
                <td>40000</td>
                <td>lokeshj022004@gmail.com</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Gokul</td>
                <td>22</td>
                <td>4000</td>
                <td>j022004@gmail.com</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Rahul</td>
                <td>27</td>
                <td>40000</td>
                <td>rahul022004@gmail.com</td>
            </tr>
        </table>
     </div>
     <div>
        <h1>Story</h1>
        <p>I my name is Lokesh and I am a software engineer.there are many people who work in this field.</p>
     </div>
     <div class="cards">
        <p>Card 1</p>
     </div>
    </body>
    </html>
    
    </>
}
export default Navbar;