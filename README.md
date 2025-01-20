# Tim Plavi Repozitorij

Back se pokrece funkcijom dotnet run

Primjer funkcije koja sa fronta poziva back: 

const tester = async () => {
    try {
      const response = await fetch('http://localhost:5149/api/Dogadjaj/1');
      const data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error(error);
    }
  }
