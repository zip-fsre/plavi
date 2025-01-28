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
            var array = _context.Dogadjajs.ToList();
            var pom = array.SingleOrDefault(item => item.Id == id);
            _context.Dogadjajs.Remove(pom);
            _context.SaveChanges();
            return _context.Dogadjajs.Find(id);
        }

        // Get: api/Dogadjaj/Partners
        [HttpGet("Partners/{id}")]
        public ActionResult<IEnumerable<JsonReturn.Models.MedjutablicaPt1>> GetPartneri(int id)
        {
            return _context.MedjutablicaPt1s.AsQueryable().Where(MedjutablicaPt1s => MedjutablicaPt1s.IdDogadjaja == id).ToList();
        }

        // Get: api/Dogadjaj/Partners
        [HttpGet("Gosti/{id}")]
        public ActionResult<IEnumerable<JsonReturn.Models.Gost>> GetGosti(int id)
        {
            return _context.Gosts.AsQueryable().Where(Gosts => Gosts.IdDogadjajaa == id).ToList();
        }
    }
}