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
    }
}