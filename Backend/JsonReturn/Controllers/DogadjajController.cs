// Controllers/DogadjajController.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DogadjajController : ControllerBase
    {
        private readonly Pi02Context _context;
        public DogadjajController(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/Dogadjaj
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.Dogadjaj>> GetDogadjajs()
        {
            return _context.Dogadjajs.ToList();
        }

        // GET: api/Dogadjaj/1
        [HttpGet("{id}")]
        public ActionResult<Dogadjaj> GetDogadjaj(int id)
        {
            var Dogadjaj = _context.Dogadjajs.Find(id);
            if (Dogadjaj == null)
            {
                return NotFound();
            }
            return Dogadjaj;
        }

        // POST: api/Dogadjaj
        [HttpPost]
        public ActionResult<Dogadjaj> CreateDogadjaj(Dogadjaj Dogadjaj)
        {
            if (Dogadjaj == null)
            {
                return BadRequest();
            }

            _context.Dogadjajs.Add(Dogadjaj);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetDogadjaj), new { id = Dogadjaj.Id }, Dogadjaj);
        }

        // POST: api/Dogadjaj/1
        [HttpPost("{id}")]
        public ActionResult<Dogadjaj> UpdateDogadjaj(int id, Dogadjaj Dogadjaj)
        {
            if (Dogadjaj == null)
            {
                return NotFound();
            }
            var arrays = _context.Dogadjajs.ToList();
            if (arrays.SingleOrDefault(item => item.Id == id) == null)
            {
                return NotFound();
            }
            var array = arrays.SingleOrDefault(item => item.Id == id);
            if(Dogadjaj.Svrha != null)array.Svrha = Dogadjaj.Svrha;
            if(Dogadjaj.Naziv != null)array.Naziv = Dogadjaj.Naziv;
            if(Dogadjaj.Datum != null)array.Datum = Dogadjaj.Datum;
            if(Dogadjaj.Napomena != null)array.Napomena = Dogadjaj.Napomena;
            if(Dogadjaj.Klijent != null)array.Klijent = Dogadjaj.Klijent;
            if(Dogadjaj.KontaktKlijenta != null)array.KontaktKlijenta = Dogadjaj.KontaktKlijenta;
            if(Dogadjaj.KontaktSponzora != null)array.KontaktSponzora = Dogadjaj.KontaktSponzora;
            if(Dogadjaj.Gosts != null)array.Gosts = Dogadjaj.Gosts;
            _context.SaveChanges();
            return array;
        }

        // DELETE: api/Dogadjaj/1
        [HttpDelete("{id}")]
        public ActionResult<Dogadjaj> DeleteDogadjaj(int id)
        {
            DeleteGoste(id);
            DeleteMedju1(id);
            var array = _context.Dogadjajs.ToList();
            var pom3 = array.SingleOrDefault(item => item.Id == id);
            _context.Dogadjajs.Remove(pom3);
            _context.SaveChanges();
            return _context.Dogadjajs.Find(id);
        }

        // Get: api/Dogadjaj/Partners/1
        [HttpGet("Partners/{id}")]
        public ActionResult<IEnumerable<JsonReturn.Models.MedjutablicaPt1>> GetPartneri(int id)
        {
            return _context.MedjutablicaPt1s.AsQueryable().Where(MedjutablicaPt1s => MedjutablicaPt1s.IdDogadjaja == id).ToList();
        }

        // Get: api/Dogadjaj/Gosti/1
        [HttpGet("Gosti/{id}")]
        public ActionResult<IEnumerable<JsonReturn.Models.Gost>> GetGosti(int id)
        {
            return _context.Gosts.AsQueryable().Where(Gosts => Gosts.IdDogadjajaa == id).ToList();
        }

        // DELETE: api/Dogadjaj/Gosti/1 - Brise sve goste za jedan dogadjaj
        [HttpDelete("Gosti/{id}")]
        public System.Collections.Generic.IEnumerable<JsonReturn.Models.Gost> DeleteGoste(int id)
        {
            var pom = _context.Gosts.ToList().Where(item => item.IdDogadjajaa == id);
            foreach(JsonReturn.Models.Gost podatak in pom){
                _context.Gosts.Remove(podatak);
            }
            _context.SaveChanges();
            return _context.Gosts;
        }

        // DELETE: api/Dogadjaj/Aranzmani/1
        [HttpDelete("Partnere/{id}")]
        public string DeletePartnere(int id)
        {
            DeleteMedju1(id);
            return "Uspjeh!";
        }

        // DELETE: api/Dogadjaj/Aranzmani/1
        [HttpDelete("Aranzmani/{id}")]
        public System.Collections.Generic.IEnumerable<JsonReturn.Models.MedjutablicaPt1> DeleteMedju1(int id)
        {
            var pom = _context.MedjutablicaPt1s.ToList().Where(item => item.IdDogadjaja == id);
            foreach(JsonReturn.Models.MedjutablicaPt1 podatak in pom){
                var pom2 = _context.MedjutablicaPt2s.ToList().Where(item => item.IdMedju1 == podatak.Id);
                foreach(JsonReturn.Models.MedjutablicaPt2 podatak2 in pom2){
                    _context.MedjutablicaPt2s.Remove(podatak2);
                }
                _context.MedjutablicaPt1s.Remove(podatak);
            }
            _context.SaveChanges();
            return _context.MedjutablicaPt1s;
        }
    }
}