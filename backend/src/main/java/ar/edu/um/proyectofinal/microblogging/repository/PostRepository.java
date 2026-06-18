package ar.edu.um.proyectofinal.microblogging.repository;

import ar.edu.um.proyectofinal.microblogging.domain.Post;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Post entity.
 *
 * When extending this class, extend PostRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface PostRepository extends PostRepositoryWithBagRelationships, JpaRepository<Post, Long> {
    default Optional<Post> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Post> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Post> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    default Page<Post> findAllWithEagerRelationships(Pageable pageable, Long blogId) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationshipsByBlogId(blogId, pageable));
    }

    default Page<Post> findAllWithEagerRelationships(Pageable pageable, String tagName) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationshipsByTagName(tagName, pageable));
    }

    Page<Post> findByBlog_Id(Long blogId, Pageable pageable);

    @Query(value = "select post from Post post left join fetch post.blog left join fetch post.blog.user", countQuery = "select count(post) from Post post")
    Page<Post> findAllWithToOneRelationships(Pageable pageable);

    @Query(value = "select post from Post post left join fetch post.blog left join fetch post.blog.user where post.blog.id =:blogId", countQuery = "select count(post) from Post post where post.blog.id =:blogId")
    Page<Post> findAllWithToOneRelationshipsByBlogId(@Param("blogId") Long blogId, Pageable pageable);

    @Query(value = "select post from Post post left join fetch post.blog left join fetch post.blog.user left join post.tags tag where tag.name =:tagName", countQuery = "select count(post) from Post post left join post.tags tag where tag.name =:tagName")
    Page<Post> findAllWithToOneRelationshipsByTagName(@Param("tagName") String tagName, Pageable pageable);

    @Query("select post from Post post left join fetch post.blog left join fetch post.blog.user")
    List<Post> findAllWithToOneRelationships();

    @Query("select post from Post post left join fetch post.blog left join fetch post.blog.user where post.id =:id")
    Optional<Post> findOneWithToOneRelationships(@Param("id") Long id);
}
