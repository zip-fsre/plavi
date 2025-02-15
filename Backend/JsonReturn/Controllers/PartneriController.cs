// Controllers/PartneriController.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartneriController : ControllerBase
    {
        private readonly Pi02Context _context;
        public PartneriController(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/Partneri
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.Partneri>> GetPartneris()
        {
            return _context.Partneris.ToList();
        }

        // GET: api/Partneri/1
        [HttpGet("{id}")]
        public ActionResult<Partneri> GetPartneri(int id)
        {
            var Partneri = _context.Partneris.Find(id);
            if (Partneri == null)
            {
                return NotFound();
            }
            return Partneri;
        }

        // POST: api/Partneri
        [HttpPost]
        public ActionResult<Partneri> CreatePartneri(Partneri Partneri)
        {
            if (Partneri == null)
            {
                return BadRequest();
            }

            _context.Partneris.Add(Partneri);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetPartneri), new { id = Partneri.Id }, Partneri);
        }

        // POST: api/Partneri/1
        [HttpPost("{id}")]
        public ActionResult<Partneri> UpdatePartneri(int id, Partneri Partneri)
        {
            if (Partneri == null)
            {
                return NotFound();
            }
            var arrays = _context.Partneris.ToList();
            if (arrays.SingleOrDefault(item => item.Id == id) == null)
            {
                return NotFound();
            }
            var array = arrays.SingleOrDefault(item => item.Id == id);
            if(Partneri.Naziv != null)array.Naziv = Partneri.Naziv;
            if(Partneri.Tip != null)array.Tip = Partneri.Tip;
            if(Partneri.Napomena != null)array.Napomena = Partneri.Napomena;
            if(Partneri.Provizija != null)array.Provizija = Partneri.Provizija;
            _context.SaveChanges();
            return array;
        }

        // DELETE: api/Partneri/1
        [HttpDelete("{id}")]
        public ActionResult<Partneri> DeletePartneri(int id)
        {
            DeleteAranzmane(id);
            var array = _context.Partneris.ToList();
            var pom = array.SingleOrDefault(item => item.Id == id);
            _context.Partneris.Remove(pom);
            _context.SaveChanges();
            return _context.Partneris.Find(id);
        }

        // Get: api/Partneri/Aranzmani/1
        [HttpGet("Aranzmani/{id}")]
        public ActionResult<IEnumerable<JsonReturn.Models.Aranzman>> GetAranzmani(int id)
        {
            return _context.Aranzmen.AsQueryable().Where(Aranzman => Aranzman.IdPartnera == id).ToList();
        }

        // DELETE: api/Partneri/Aranzmani/1 - Brise sve goste za jedan dogadjaj
        [HttpDelete("Aranzmani/{id}")]
        public System.Collections.Generic.IEnumerable<JsonReturn.Models.MedjutablicaPt1> DeleteAranzmane(int id)
        {
            var pom0 = _context.Aranzmen.ToList().Where(item => item.IdPartnera == id);
            foreach(JsonReturn.Models.Aranzman podatak0 in pom0){
                var pom = _context.MedjutablicaPt1s.ToList().Where(item => item.IdDogadjaja == id);
                foreach(JsonReturn.Models.MedjutablicaPt1 podatak in pom){
                    var pom2 = _context.MedjutablicaPt2s.ToList().Where(item => item.IdMedju1 == podatak.Id);
                    foreach(JsonReturn.Models.MedjutablicaPt2 podatak2 in pom2){
                        _context.MedjutablicaPt2s.Remove(podatak2);
                    }
                    _context.MedjutablicaPt1s.Remove(podatak);
                }
                _context.Aranzmen.Remove(podatak0);
            }
            _context.SaveChanges();
            return _context.MedjutablicaPt1s;
        }
    }
}