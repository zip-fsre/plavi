// Controllers/IzvjesceController.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IzvjesceController : ControllerBase
    {
        private readonly Pi02Context _context;
        public IzvjesceController(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/Izvjesce
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.Izvjesce>> GetIzvjesces()
        {
            return _context.Izvjesces.ToList();
        }

        // GET: api/Izvjesce/1
        [HttpGet("{id}")]
        public ActionResult<Izvjesce> GetIzvjesce(int id)
        {
            var Izvjesce = _context.Izvjesces.Find(id);
            if (Izvjesce == null)
            {
                return NotFound();
            }
            return Izvjesce;
        }

        // POST: api/Izvjesce
        [HttpPost]
        public ActionResult<Izvjesce> CreateIzvjesce(Izvjesce Izvjesce)
        {
            if (Izvjesce == null)
            {
                return BadRequest();
            }

            _context.Izvjesces.Add(Izvjesce);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetIzvjesce), new { id = Izvjesce.Id }, Izvjesce);
        }

        // POST: api/Izvjesce/1
        [HttpPost("{id}")]
        public ActionResult<Izvjesce> UpdateIzvjesce(int id, Izvjesce Izvjesce)
        {
            if (Izvjesce == null)
            {
                return NotFound();
            }
            var arrays = _context.Izvjesces.ToList();
            if (arrays.SingleOrDefault(item => item.Id == id) == null)
            {
                return NotFound();
            }
            var array = arrays.SingleOrDefault(item => item.Id == id);
            if(Izvjesce.Naziv != null)array.Naziv = Izvjesce.Naziv;
            if(Izvjesce.Opis != null)array.Opis = Izvjesce.Opis;
            if(Izvjesce.Pocetak != null)array.Pocetak = Izvjesce.Pocetak;
            if(Izvjesce.Kraj != null)array.Kraj = Izvjesce.Kraj;
            if(Izvjesce.OdabraniPartner != null)array.OdabraniPartner = Izvjesce.OdabraniPartner;
            _context.SaveChanges();
            return array;
        }

        // DELETE: api/Izvjesce/1
        [HttpDelete("{id}")]
        public ActionResult<Izvjesce> DeleteIzvjesce(int id)
        {
            var array = _context.Izvjesces.ToList();
            var pom = array.SingleOrDefault(item => item.Id == id);
            _context.Izvjesces.Remove(pom);
            _context.SaveChanges();
            return _context.Izvjesces.Find(id);
        }

        // Get: api/Izvjesce/Podatci
        [HttpGet("Podatci/{id}")]
        public ActionResult<IEnumerable<JsonReturn.Models.MedjutablicaPt2>> GetMedju2(int id)
        {
            return _context.MedjutablicaPt2s.AsQueryable().Where(Podatci => Podatci.IdIzvjesca == id).ToList();
        }

        // DELETE: api/Izvjesce/Podaci/1
        [HttpDelete("Podaci/{id}")]
        public System.Collections.Generic.IEnumerable<JsonReturn.Models.MedjutablicaPt2> DeletePodatke(int id)
        {
            var pom = _context.MedjutablicaPt2s.ToList().Where(item => item.IdIzvjesca == id);
            foreach(JsonReturn.Models.MedjutablicaPt2 podatak in pom){
                _context.MedjutablicaPt2s.Remove(podatak);
            }
            _context.SaveChanges();
            return _context.MedjutablicaPt2s;
        }
    }
}