// Controllers/MedjutablicaPt2Controller.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedjutablicaPt2Controller : ControllerBase
    {
        private readonly Pi02Context _context;
        public MedjutablicaPt2Controller(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/MedjutablicaPt2
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.MedjutablicaPt2>> GetMedjutablicaPt2s()
        {
            return _context.MedjutablicaPt2s.ToList();
        }

        // GET: api/MedjutablicaPt2/1
        [HttpGet("{id}")]
        public ActionResult<MedjutablicaPt2> GetMedjutablicaPt2(int id)
        {
            var MedjutablicaPt2 = _context.MedjutablicaPt2s.Find(id);
            if (MedjutablicaPt2 == null)
            {
                return NotFound();
            }
            return MedjutablicaPt2;
        }

        // POST: api/MedjutablicaPt2
        [HttpPost]
        public ActionResult<MedjutablicaPt2> CreateMedjutablicaPt2(MedjutablicaPt2 MedjutablicaPt2)
        {
            if (MedjutablicaPt2 == null)
            {
                return BadRequest();
            }

            _context.MedjutablicaPt2s.Add(MedjutablicaPt2);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMedjutablicaPt2), new { id = MedjutablicaPt2.Id }, MedjutablicaPt2);
        }
    }
}