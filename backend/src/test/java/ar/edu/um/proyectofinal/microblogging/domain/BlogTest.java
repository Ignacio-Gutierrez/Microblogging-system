package ar.edu.um.proyectofinal.microblogging.domain;

import static ar.edu.um.proyectofinal.microblogging.domain.BlogTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import ar.edu.um.proyectofinal.microblogging.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BlogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Blog.class);
        Blog blog1 = getBlogSample1();
        Blog blog2 = new Blog();
        assertThat(blog1).isNotEqualTo(blog2);

        blog2.setId(blog1.getId());
        assertThat(blog1).isEqualTo(blog2);

        blog2 = getBlogSample2();
        assertThat(blog1).isNotEqualTo(blog2);
    }

    @Test
    void testBlogValidationSuccess() {
        Blog blog = new Blog();
        blog.setName("Mi blog de prueba");
        blog.setHandle("um");

        assertThat(blog.getName()).isEqualTo("Mi blog de prueba");
        assertThat(blog.getHandle()).isEqualTo("um");
    }

    @Test
    void testBlogCanBeAssignedToUser() {
        Blog blog = new Blog();
        User user = new User();

        blog.user(user);

        assertThat(blog.getUser()).isEqualTo(user);
    }
}
