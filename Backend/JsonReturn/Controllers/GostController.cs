// Controllers/GostController.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GostController : ControllerBase
    {
        private readonly Pi02Context _context;
        public GostController(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/Gost
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.Gost>> GetGosts()
        {
            return _context.Gosts.ToList();
        }

        // GET: api/Gost/1
        [HttpGet("{id}")]
        public ActionResult<Gost> GetGost(int id)
        {
            var Gost = _context.Gosts.Find(id);
            if (Gost == null)
            {
                return NotFound();
            }
            return Gost;
        }

        // POST: api/Gost
        [HttpPost]
        public ActionResult<Gost> CreateGost(Gost Gost)
        {
            if (Gost == null)
            {
                return BadRequest();
            }

            _context.Gosts.Add(Gost);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetGost), new { id = Gost.Id }, Gost);
        }

        // POST: api/Gost/1
        [HttpPost("{id}")]
        public ActionResult<Gost> UpdateGost(int id, Gost Gost)
        {
            if (Gost == null)
            {
                return NotFound();
            }
            var arrays = _context.Gosts.ToList();
            if (arrays.SingleOrDefault(item => item.Id == id) == null)
            {
                return NotFound();
            }
            var array = arrays.SingleOrDefault(item => item.Id == id);
            if(Gost.ImeIPrezime != null)array.ImeIPrezime = Gost.ImeIPrezime;
            if(Gost.StatusDolaska != null)array.StatusDolaska = Gost.StatusDolaska;
            if(Gost.BrojStola != null)array.BrojStola = Gost.BrojStola;
            _context.SaveChanges();
            return array;
        }

        // DELETE: api/Gost/1
        [HttpDelete("{id}")]
        public ActionResult<Gost> DeleteGost(int id)
        {
            var array = _context.Gosts.ToList();
            var pom = array.SingleOrDefault(item => item.Id == id);
            _context.Gosts.Remove(pom);
            _context.SaveChanges();
            return _context.Gosts.Find(id);
        }

        // DELETE: api/Gost/Gosti/1 - Brise sve goste za jedan dogadjaj (id je id_dogadjaja)
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

        // POST: api/Gost/Vise
        [HttpPost("Vise")]
        public string CreateGosti(Gost[] Gosti)
        {
            if (Gosti == null)
            {
                return "Missing parameter: Gosti";
            }
            foreach(Gost Gost in Gosti){
                _context.Gosts.Add(Gost);
            }
            _context.SaveChanges();
            return "Uspjesno";
        }



    }
}